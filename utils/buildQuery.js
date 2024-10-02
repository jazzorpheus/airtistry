//* Used to help build Mongoose queries involving filtering, sorting, limiting, pagination

class buildQuery {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  //? Advanced Filtering
  filter() {
    // Create shallow copy of query object
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...this.queryString };

    // Remove unwanted fields not used for filtering on queryObj
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // A query of, e.g. difficulty: easy, duration: >=5 would look like:
    // { difficulty: "easy", duration: { $gte: 5 } }
    // Postman request: "127.0.0.1:8000/api/v1/airtworks?duration[gte]=5&difficulty=easy"
    // Generates query of { duration: { gte: '5' }, difficulty: 'easy' } so need to replace
    // "gte" with "$gte" (see below)
    let queryStr = JSON.stringify(queryObj);
    // RegExp /\b(gte|gt|lte|lt)\b/ matches all ("\g") exact ("\b") words "gte", "gt", etc.
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  //? Sorting
  sort() {
    // NOTE: to sort descending need to include a "-" before field to sort by in query string
    if (this.queryString.sort) {
      // Create array of sort criteria from the comma-separated values in sort param.
      // Then join them together into a string with each element separated by a space
      // (This is the format Mongoose wants the argument in "sort" method below)
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // If no sort param in query, default to sort desc by time created
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  //? Limiting
  limitFields() {
    // Sometimes the user may only want the API to return certain fields
    if (this.queryString.fields) {
      // Create array of fields from the comma-separated values in field para.
      // Then join them together into a string with each element separated by a space
      // (This is the format Mongoose wants the argument in "select" method below)
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      // By default, exclude __v field (Mongoose uses this internally but it is of no
      // interest to the user).
      this.query = this.query.select("-__v");
    }

    return this;
  }

  //? Pagination
  paginate() {
    // Quick trick to convert string to number if page param set,
    // otherwise, use default page of 1.
    const page = this.queryString.page * 1 || 1;
    // Convert to number or use default of 100
    const limit = this.queryString.limit * 1 || 100;
    // Number of results to skip to simulate pages
    // "page=2&limit=10" means user wants page 2 with 10 results per page,
    // i.e. skip results 1-10 (page 1), and start getting results from
    // result 11 and limit returned results to 10, i.e. return results 11-20,
    // which will correspond to page 2.
    const skip = (page - 1) * limit;

    // Call Mongoose methods skip() and limit() on query to get desired results
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = buildQuery;

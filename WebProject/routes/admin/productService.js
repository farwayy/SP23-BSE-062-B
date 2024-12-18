// const Product = require("../models/Product");

// /**
//  * Fetch products with filtering, sorting, and pagination
//  * @param {Object} options - Filtering and sorting options
//  * @param {number} page - Current page number
//  * @param {number} pageSize - Number of items per page
//  * @returns {Object} - Paginated products, total records, and total pages
//  */
// async function getProducts({ search, sort }, page, pageSize) {
//   const filter = {};

//   // Filtering
//   if (search) {
//     filter.$or = [
//       { title: { $regex: search, $options: "i" } },
//       { description: { $regex: search, $options: "i" } },
//     ];
//   }

//   // Sorting
//   const sortOptions = {
//     price_asc: { price: 1 },
//     price_desc: { price: -1 },
//     title_asc: { title: 1 },
//     title_desc: { title: -1 },
//   };
//   const sortCriteria = sortOptions[sort] || {};

//   // Pagination Calculations
//   const totalRecords = await Product.countDocuments(filter);
//   const totalPages = Math.ceil(totalRecords / pageSize);

//   // Fetch Products
//   const products = await Product.find(filter)
//     .sort(sortCriteria)
//     .skip((page - 1) * pageSize)
//     .limit(pageSize);

//   return {
//     products,
//     totalRecords,
//     totalPages,
//   };
// }

// module.exports = {
//   getProducts,
// };

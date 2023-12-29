/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {

  return knex("subcategories").del().then(() => knex('categories').del())
    .then(function () {
      return knex("categories").insert([
        { name: "cars", full_name: "Cars" },
        { name: "electronics", full_name: "Electronics" },
        { name: "clothes", full_name: "Clothes" },
      ]);
    }).then(function () {
      return knex("subcategories").insert([
        { name: "laptops", full_name: "Laptops, ultrabooks", category_id: 2 },
        { name: "tablets", full_name: "Tablets", category_id: 2 },
        { name: "ebooks", full_name: "E-books", category_id: 2 },
      ]);
    });
};

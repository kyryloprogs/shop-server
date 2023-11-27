/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {

    return knex("categories").del().then(() => knex('subcategories').del())
      .then(function () {
        return knex("categories").insert([
          { name: "cars" },
          { name: "electronics" },
          { name: "clothes" },
        ]);
      });

      // .then(function () {
      //   return knex("subcategories").insert([
      //       { name: "" },
      //       { name: "1" },
      //       { name: "2" },
      //     ]);
      // });
  };
  
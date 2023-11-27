/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {

  return knex("roles").del()
    .then(function () {
      return knex("roles").insert([
        { role_name: "User" },
        { role_name: "Admin" },
      ]);
    })
};

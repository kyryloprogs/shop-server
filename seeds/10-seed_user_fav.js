/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('users_favorite_products').del()
    await knex('users_favorite_products').insert([
      {userID: 1, productID: 1},
      {userID: 2, productID: 1},
      {userID: 2, productID: 1},
      {userID: 1, productID: 2},
      {userID: 2, productID: 3},
      {userID: 1, productID: 3},
    ]);
  };
  
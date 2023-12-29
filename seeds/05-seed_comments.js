/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('products_comments').del()
  await knex('products_comments').insert([
    {product_id: 1, user_id: 1, comment: '123'},
    {product_id: 2, user_id: 1, comment: 'rowVal235354ue1'},
    {product_id: 2, user_id: 1, comment: 'rowVa5245lue1'},
    {product_id: 1, user_id: 2, comment: 'row234Value1'},
    {product_id: 2, user_id: 2, comment: 'rowV324alue1'},
    {product_id: 1, user_id: 2, comment: 'rowV1231alue1'},
  ]);
};

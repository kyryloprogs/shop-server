/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('products_comments').del()
  await knex('products_comments').insert([
    {product_id: 1, user_id: 1, comment: 'rowValue1', like: true},
    {product_id: 2, user_id: 1, comment: 'rowValue1', like: false},
    {product_id: 2, user_id: 1, comment: 'rowValue1', like: true},
    {product_id: 1, user_id: 2, comment: 'rowValue1', like: false},
    {product_id: 2, user_id: 2, comment: 'rowValue1', like: true},
    {product_id: 1, user_id: 2, comment: 'rowValue1', like: false},
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('price_history').del()
  await knex('price_history').insert([
    {product_id: 1, price: 120, sale: 0, clear_price: 120, regDate: new Date(2023, 1, 3)},
    {product_id: 1, price: 90, sale: 30, clear_price: 120, regDate: new Date(2023, 2, 3)},
    {product_id: 1, price: 120, sale: 0, clear_price: 120, regDate: new Date(2023, 4, 3)},
    {product_id: 1, price: 200, sale: 0, clear_price: 120, regDate: new Date(2023, 5, 3)},
    {product_id: 1, price: 120, sale: 0, clear_price: 120, regDate: new Date(2023, 6, 3)},
  ]);
};
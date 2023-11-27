/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('price_history', function(table){
        table.increments().primary();
        table.integer('product_id',11).unsigned().references('id').inTable('products');
        table.integer('price',11).unsigned();
        table.integer('clear_price',11).unsigned();
        table.integer('sale', 3);
        table.timestamp('regDate');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('price_history')
};

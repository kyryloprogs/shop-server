/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    // return knex.schema.createTable('products_categories', function(table){
    //     table.increments().primary();
    //     table.integer('productID',11).unsigned().references('id').inTable('products');
    //     table.integer('categoryID',11).unsigned().references('id').inTable('categories');
    // });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  // return knex.schema.dropTable('products_categories')
};

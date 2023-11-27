
const faker = require('faker');
  
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


exports.up = function(knex) {
    return knex.schema.createTable("products", table => {
        table.increments("id").primary();
        table.string("name", 300).notNullable();
        table.string("description", 3000).notNullable();
        table.float("price", 10, 2).unsigned();
        table.integer('sale', 3);
        table.string("main_img");
        table.integer('category_id').unsigned().references('id').inTable('categories').onDelete('SET NULL');
        // table.integer('subcaterory_id').unsigned().references('id').inTable('subcategories').onDelete('SET NULL');
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("products");
};

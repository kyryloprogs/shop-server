/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('product_images', function(table){
        table.increments("id").primary();
        // table.integer("productId").references('id').inTable('products').onDelete('CASCADE');
        table.integer("productId").unsigned();
        table.foreign("productId").references("products.id");
        table.string('imageUrl').defaultTo("");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('product_images')
};

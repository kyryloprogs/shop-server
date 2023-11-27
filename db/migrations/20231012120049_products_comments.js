/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('products_comments', function(table){
        table.increments().primary();

        table.integer("user_id", 100).unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer("product_id", 100).unsigned().references('id').inTable('products').onDelete('CASCADE');
        table.string("comment", 3000).notNullable();
        table.boolean('like').defaultTo(true);
        table.timestamps(false, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('products_comments')
};

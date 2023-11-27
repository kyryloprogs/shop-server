/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users_favorite_products', function(table){
        table.increments().primary();
        table.integer('userID').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('productID').unsigned().references('id').inTable('products').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("users_favorite_products");
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('actions_counter', function(table){
        table.increments().primary();
        table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE');
        table.integer('likes_count').unsigned().defaultTo(0);
        table.integer('dislikes_count').unsigned().defaultTo(0);
        table.integer('favorites_count').unsigned().defaultTo(0);
        table.integer('views_count').unsigned().defaultTo(0);
        table.integer('comments_count').unsigned().defaultTo(0);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('actions_counter')
};

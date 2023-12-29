/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("subcategories", table => {
        table.increments("id").primary();
        table.string("name", 100).notNullable();        
        table.string("full_name", 100).notNullable();
        table.integer("category_id").unsigned();
        table.foreign("category_id").references("categories.id");
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("subcategories");
};

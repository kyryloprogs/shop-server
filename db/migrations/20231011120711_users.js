/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("users", table => {
    table.increments("id").primary();
    table.string("first_name", 100).notNullable();
    table.string("last_name", 100).notNullable();
    table.string("email", 255).notNullable();
    table.string("password", 255);
    table.string("avatar");
    table.string("phone", 30);
    table.boolean("get_updates").defaultTo(false);
    table.integer("role_id").unsigned().defaultTo(1);
    table.foreign("role_id").references("roles.id");
    table.timestamps(false, true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("users");
};

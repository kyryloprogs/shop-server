/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('product_attributes', function(table){
        table.integer('productID',11).unsigned().references('id').inTable('products').onDelete('CASCADE');
        table.integer('attributeID',11).unsigned().references('id').inTable('attributes').onDelete('CASCADE');
        table.boolean('isMain').defaultTo(false);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('product_attributes')
};

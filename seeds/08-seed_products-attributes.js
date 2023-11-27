/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {

    return knex("product_attributes").del()
        .then(function () {
            return knex("product_attributes").insert([
                { productID: 1, attributeID: 1 },
                { productID: 2, attributeID: 1 },
                { productID: 2, attributeID: 2 },
                { productID: 2, attributeID: 3 },
                { productID: 1, attributeID: 4 },
                { productID: 1, attributeID: 5 },
                { productID: 1, attributeID: 6 },
            ]);
        })
};

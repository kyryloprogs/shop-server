/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {

    return knex("attributes").del()
        .then(function () {
            return knex("attributes").insert([
                { name: "resolution", value: "480x1080" },
                { name: "resolution", value: "720x1080" },
                { name: "resolution", value: "1080x1920" },
                { name: "charger", value: "Type-C" },
                { name: "charger", value: "micro USB" },
                { name: "phone", value: "Yes" },
                { name: "phone", value: "No" },
            ]);
        })
};

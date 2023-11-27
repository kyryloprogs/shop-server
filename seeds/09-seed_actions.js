const USER_COUNT = 100;
const TABLE_NAME = "actions_counter"

/** @param {import("knex").Knex} knex */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex(TABLE_NAME).del();
    let i = 0;
    // Inserts seed entries
    return knex(TABLE_NAME).insert(
        Array.from({ length: USER_COUNT }, () => {
            i++;
            return {
                product_id: i,
                likes_count: 3,
                dislikes_count: 3,
                favorites_count: 3,
                views_count: 3,
                comments_count: 3
            }
        })
    );
};
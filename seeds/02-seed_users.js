const faker = require("faker");

function generateRandomUser() {
  const user = faker.helpers.contextualCard();
  return {
      // username: user.username,
      // password is required. so we need to throw any value to avoid errors.
      // in real world scenario we will hash the password 
      password: "1234",
      email: user.email,
      first_name: user.name,
      last_name: user.name,
      avatar: user.avatar,

  };
}

const USER_COUNT = 10;
const TABLE_NAME = "users"

/** @param {import("knex").Knex} knex */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex(TABLE_NAME).del();

    // Inserts seed entries
    return knex(TABLE_NAME).insert(
        Array.from({ length: USER_COUNT }, () => {
            return generateRandomUser();
        })
    );
};
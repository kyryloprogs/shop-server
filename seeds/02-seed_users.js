const faker = require("faker");
const crypto = require('crypto');

const hashPassword = (password) => {
    const salt = process.env.SALT || "";
    return crypto.pbkdf2Sync(password, salt, 100, 64, `sha256`).toString(`hex`);
};

function generateRandomUser() {
  const user = faker.helpers.contextualCard();
  return {
      // username: user.username,
      // password is required. so we need to throw any value to avoid errors.
      // in real world scenario we will hash the password 
      password: hashPassword("1234"),
      role_id: 1,
      email: user.email,
      first_name: user.name,
      last_name: user.name,
      avatar: user.avatar,
    //   phone: "1235678990"

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
const faker = require("faker");

function getRandomImageLink() {
    const imageWidth = 600;
    const imageHeight = 700;
    return `https://picsum.photos/${imageWidth}/${imageHeight}?random`;
  }

const generateRandomRecord = () => ({
    name: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    price: parseFloat(faker.commerce.price()),
    category_id: 1,
    main_img: getRandomImageLink()
    // subcategory: 1
});

const USER_COUNT = 100;
const TABLE_NAME = "products"

/** @param {import("knex").Knex} knex */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex(TABLE_NAME).del();

    // Inserts seed entries
    return knex(TABLE_NAME).insert(
        Array.from({ length: USER_COUNT }, () => {
            return generateRandomRecord();
        })
    );
};




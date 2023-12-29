import { Model } from 'objection'
import User from './User'
import ActionsCounter from './ActionsCounter';

export default class Product extends Model {
  id!: number
  name!: string
  description!: string
  price: number
  main_img: string
  sale: number
  category_id: number

  // Table name is the only required property.
  static tableName = 'products'

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: 'object',
    required: ['name', 'description', 'price'],

    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      description: { type: 'string', minLength: 1, maxLength: 1000 },
      price: { type: 'number' },
      main_img: { type: 'string', minLength: 1, maxLength: 1000 },
      sale: { type: 'number' },
      category_id: { type: 'integer' },
      // attributes: { type: 'json' }
    },
  }

  async $afterInsert(queryContext) {
    await super.$afterInsert(queryContext);
    // This can always be done even if there is no running transaction. In that
    // case `queryContext.transaction` returns the normal knex instance. This
    // makes sure that the query is not executed outside the original query's
    // transaction.
    await ActionsCounter.query(queryContext.transaction).insert({
      product_id: this.id,
    });

  }

  static get relationMappings() {
    return {
      attributes: {
        relation: Model.ManyToManyRelation,
        modelClass: require('./Attributes').default,
        join: {
          from: 'products.id',
          through: {
            from: 'product_attributes.productID',
            to: 'product_attributes.attributeID'
          },
          to: 'attrubutes.id'
        }
      },
      productCategory: {
        relation: Model.BelongsToOneRelation,
        modelClass: require('./Category').default,
        join: {
          from: 'product.category_id',
          to: 'categories.id'
        }
      },
      images: {
        relation: Model.HasManyRelation,
        modelClass: require('./ProductImage').default,
        join: {
          from: 'products.id',
          to: 'product_images.productId',
        },
      },
    }
  }
}
//   async function getAttributesForProductsByName(productName) {
//     const attributes = await Product.query()
//       .where('name', 'like', `%${productName}%`)
//       .withGraphFetched('attributes')
//       .distinct('attributes.id', 'attributes.name', 'attributes.value');
  
//     return attributes;
//   }
// }




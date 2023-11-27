import { Model } from 'objection'
import User from './User'
import Product from './Product'

export default class Favorite extends Model {
  id!: number
  userID!: number
  productID!: number

  // Table name is the only required property.
  static tableName = 'users_favorite_products'

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: 'object',
    required: ['userID', 'productID'],

    properties: {
      id: { type: 'integer' },
      userID: { type: 'integer' },
      productID: { type: 'integer' },
    },
  }

  // This object defines the relations to other models. The relationMappings
  // property can be a thunk to prevent circular dependencies.
  // static relationMappings = () => ({
  //   actors: {
  //     relation: Model.ManyToManyRelation,

  //     // The related model.
  //     modelClass: User,

  //     join: {
  //       from: 'products.id',

  //       // ManyToMany relation needs the `through` object to describe the join table.
  //       through: {
  //         from: 'users_favorite_products.productId',
  //         to: 'users_favorite_products.userId',
  //       },

  //       to: 'users.id',
  //     },
  //   },
  // })
}
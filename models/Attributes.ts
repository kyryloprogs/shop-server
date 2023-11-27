import { Model } from 'objection'

export default class Attribute extends Model {
  id!: number
  name!: string
  value!: string

  static tableName = 'attributes'

  static get idColumn() {
    return 'id';
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: 'object',
    required: ['name', 'value'],

    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      value: { type: 'string', minLength: 1, maxLength: 255 },
    },
  }

  // This object defines the relations to other models. The relationMappings
  // property can be a thunk to prevent circular dependencies.

  static get relationMappings() {
    console.log(1)
    return {
      products: {
        relation: Model.ManyToManyRelation,
        modelClass: require('./Product').default,
        join: {
          from: 'attributes.id',
          through: {
            from: 'product_attributes.attributeID',
            to: 'product_attributes.productID'
          },
          to: 'products.id'
        }
      },
    }
  }
}

import { Model } from 'objection'

export default class Role extends Model {
  id!: number
  role_name!: string

  static tableName = 'roles'

  static get idColumn() {
    return 'id';
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: 'object',
    required: ['role_name'],

    properties: {
      id: { type: 'integer' },
      role_name: { type: 'string', minLength: 1, maxLength: 255 },
    },
  }

  // This object defines the relations to other models. The relationMappings
  // property can be a thunk to prevent circular dependencies.
  static relationMappings = () => ({
    parent: {
      relation: Model.BelongsToOneRelation,
      modelClass: Role,
      join: {
        from: 'persons.parentId',
        to: 'persons.id',
      },
    },
  })
}
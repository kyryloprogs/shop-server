import { Model } from 'objection'

export default class Category extends Model {
    id!: number
    name!: string

    // Table name is the only required property.
    static tableName = 'categories'

    static jsonSchema = {
        type: 'object',
        required: ['name'],

        properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
        },
    }

    static get relationMappings() {
        return {
            products: {
                relation: Model.HasManyRelation, 
                modelClass: require('./Product').default,
                join: {
                    from: 'categories.id',
                    to: 'products.category_id'
                }
            }
        };
    };
}




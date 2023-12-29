import { Model } from 'objection'

export default class Subcategory extends Model {
    id!: number
    name!: string
    full_name: string
    category_id: number
    // Table name is the only required property.
    static tableName = 'subcategories'

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
                    from: 'subcategories.id',
                    to: 'products.category_id'
                }
            }
        };
    };
}




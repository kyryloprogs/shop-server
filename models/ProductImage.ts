import { Model } from 'objection';

export default class ProductImage extends Model {
    id!: number
    productId: number
    imageUrl: string
    
    static tableName = 'product_images';

    static jsonSchema = {
        type: 'object',
        required: ['productId', 'imageUrl'],

        properties: {
            id: { type: 'integer' },
            productId: { type: 'integer' },
            imageUrl: { type: 'string', minLength: 1, maxLength: 1000 },
        },
    };

    static relationMappings = {
        product: {
            relation: Model.BelongsToOneRelation,
            modelClass: require('./Product').default,
            join: {
                from: 'product_images.productId',
                to: 'products.id',
            },
        },
    };
}
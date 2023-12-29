import { Model, QueryContext } from 'objection'
import ActionsCounter from './ActionsCounter';

export default class Comment extends Model {
    id!: number
    user_id!: number
    product_id!: number
    comment!: string
    like!: boolean

    // Table name is the only required property.
    static tableName = 'products_comments'

    static jsonSchema = {
        type: 'object',
        required: ['user_id', 'product_id', 'comment'],

        properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            product_id: { type: 'integer' },
            comment: { type: 'string', minLength: 1, maxLength: 3000 },
            like: { type: 'boolean' },
            created_at: { type: 'string' }
        },
    }

    async $afterInsert(queryContext: QueryContext): Promise<any> {
        await super.$beforeInsert(queryContext);

        const commentCount = Comment.query(queryContext.transaction)
        // .select('*')
        .count();

        await ActionsCounter.query(queryContext.transaction).update(
            {
                product_id: this.product_id,
                comments_count: commentCount
            }
        ).where({ product_id : this.product_id });
    }

    async $afterDelete(queryContext: QueryContext): Promise<any> {
        await super.$afterDelete(queryContext);

        const commentCount = Comment.query(queryContext.transaction).count();


        await ActionsCounter.query(queryContext.transaction).update(
            {
                product_id: this.product_id,
                comments_count: commentCount
            }
        ).where({ product_id : this.product_id });
    }

}



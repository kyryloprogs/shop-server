import { Model } from 'objection'

export default class SearchBase extends Model {
    id!: number
    text!: string
    count: number

    static tableName = 'search_base'

    static jsonSchema = {
        type: 'object',
        required: ['text'],

        properties: {
            id: { type: 'integer' },
            text: { type: 'string' },
            count: { type: 'integer' },
        },
    }
}




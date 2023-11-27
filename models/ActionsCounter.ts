import { Model } from 'objection'

export default class ActionsCounter extends Model {
  id!: number
  product_id!: number
  likes_count!: number
  comments_count!: number
  favorites_count!: number
  views_count!: number
  dislike_count!: number

  // Table name is the only required property.
  static tableName = 'actions_counter'

  static jsonSchema = {
    type: 'object',
    required: ['product_id'],

    properties: {
      id: { type: 'integer' },
      product_id: { type: 'integer'},
      views_count: { type: 'integer'},
      likes_count: { type: 'integer' },
      comments_count: { type: 'integer' },
      favorites_count: { type: 'integer' },
      dislike_count: { type: 'integer' },
    },
  }
}


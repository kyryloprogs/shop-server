import { Model } from 'objection'

export default class PriceHistory extends Model {
  id!: number
  product_id!: number
  sale!: number
  price!: number  
  clear_price!: number
  regDate: number

  // Table name is the only required property.
  static tableName = 'price_history'

  static jsonSchema = {
    type: 'object',
    required: ['product_id'],

    properties: {
      id: { type: 'integer' },
      product_id: { type: 'integer'},
      sale: { type: 'number'},
      price: { type: 'number'},      
      clear_price: { type: 'number'},
    },
  }
}


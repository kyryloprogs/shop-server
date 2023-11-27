import { Model } from 'objection';

export default class ProductAttributes extends Model {
  static get tableName() {
    return 'product_attributes';
  }

  static get relationMappings() {
    return {
      attribute: {
        relation: Model.BelongsToOneRelation,
        modelClass: require('./Attributes').default,
        join: {
          from: 'product_attributes.attributeID', // Point to the junction table
        //   through: {
        //     from: 'product_attributes.attributeID', // Point to the junction table
        //     to: 'product_attributes.attributeID', // Point to the junction table 
        //   },
          to: 'attributes.id', // Point to the related table
        },
      },
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: require('./Product').default,
        join: {
          from: 'product_attributes.productID', // P oint to the junction table
        //   through: {
        //     from: 'product_attributes.productID', // Point to the junction table
        //     to: 'product_attributes.productID', // Point to the junction table
        //   },
          to: 'products.id', // Point to the related table
        },
      },
    };
  }
}
import { Model, Modifiers } from 'objection'
import Product from './Favorite';

export default class User extends Model {
  id!: number
  first_name!: string
  last_name!: string
  email!: string
  password!: string
  role_id: number
  favorites?: Product[]
  avatar: string
  get_updates: boolean
  phone: string

  // Table name is the only required property.
  static tableName = 'users'

  static get idColumn() {
    return 'id';
  }

  fullName() {
    return this.first_name + ' ' + this.last_name;
  }
  
  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: 'object',
    required: ['first_name', 'last_name', 'email', 'password', 'get_updates'],

    properties: {
      id: { type: 'integer' },
      first_name: { type: 'string', minLength: 1, maxLength: 255 },
      last_name: { type: 'string', minLength: 1, maxLength: 255 },
      email: { type: 'string', minLength: 3, maxLength: 255 },
      password: { type: 'string', minLength: 3, maxLength: 255 },
      get_updates: { type: 'boolean' },
      avatar: { type: 'string' },
      role_id: { type: 'integer' }
    },
  }

  // Modifiers are reusable query snippets that can be used in various places.
  // static modifiers: Modifiers = {
  //   // Our example modifier is a a semi-dumb fuzzy name match. We split the
  //   // name into pieces using whitespace and then try to partially match
  //   // each of those pieces to both the `firstName` and the `lastName`
  //   // fields.
  //   searchByName(query, name) {
  //     // This `where` simply creates parentheses so that other `where`
  //     // statements don't get mixed with the these.
  //     query.where((query) => {
  //       for (const namePart of name.trim().split(/\s+/)) {
  //         for (const column of ['firstName', 'lastName']) {
  //           query.orWhereRaw('lower(??) like ?', [column, namePart.toLowerCase() + '%'])
  //         }
  //       }
  //     })
  //   },
  // }

  // This object defines the relations to other models. The relationMappings
  // property can be a thunk to prevent circular dependencies.
  static relationMappings = () => ({
    // pets: {
    //   relation: Model.HasManyRelation,
    //   // The related model. This can be either a Model subclass constructor or an
    //   // absolute file path to a module that exports one.
    //   modelClass: Animal,
    //   join: {
    //     from: 'persons.id',
    //     to: 'animals.ownerId',
    //   },
    // },

    // movies: {
    //   relation: Model.ManyToManyRelation,
    //   modelClass: Movie,
    //   join: {
    //     from: 'persons.id',
    //     // ManyToMany relation needs the `through` object to describe the join table.
    //     through: {
    //       from: 'persons_movies.personId',
    //       to: 'persons_movies.movieId',
    //     },
    //     to: 'movies.id',
    //   },
    // },

    // children: {
    //   relation: Model.HasManyRelation,
    //   modelClass: Person,
    //   join: {
    //     from: 'persons.id',
    //     to: 'persons.parentId',
    //   },
    // },
    favorites: {
      relation: Model.ManyToManyRelation,
      modelClass: Product,
      join: {
        from: 'users.id',
        // ManyToMany relation needs the `through` object to describe the join table.
        through: {
          from: 'users_favorite_products.userID',
          to: 'users_favorite_products.productID',
        },
        to: 'products.id',
      },
    },
    // children: {
    //   relation: Model.HasManyRelation,
    //   modelClass: User,
    //   join: {
    //     from: 'users.id',
    //     to: 'users.parentId',
    //   },
    // },
  })
}
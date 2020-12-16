import { usersCollection } from '../mongo.ts'

export default class User {
  public _id: any
  public email: string
  public password: string
  public name: string

  constructor({ _id = '', email = '', password = '', name = '' }) {
    this._id = _id
    this.email = email
    this.password = password
    this.name = name
  }

  static isUser(user: unknown): user is User {
    return typeof user == 'object'
      && user !== null
      && '_id' in user
      && 'email' in user
      && 'password' in user
      && 'name' in user
  }

  static async findOne(params: object) {
    const user = await usersCollection.findOne(params)
    if (user && User.isUser(user)) {
      return new User(user)
    }
  }

  async register() {
    this._id = await usersCollection.insertOne(this)
    return this
  }
}

import { usersCollection } from '../mongo.ts'

export default class User {
  _id: any
  email: string
  password: string
  name: string

  constructor ({ _id = '', email = '', password = '', name = '' }) {
    this._id = _id
    this.email = email
    this.password = password
    this.name = name
  }

  static isUser (user: User | unknown): user is User {
    return typeof user == 'object'
      && user !== null
      && '_id' in user
      && 'email' in user
      && 'password' in user
      && 'name' in user
  }

  static async findOne (params: any): Promise<User | null> {
    const user = await usersCollection.findOne(params)
    return this.isUser(user)
      ? new User(user)
      : null
  }

  async register () {
    this._id = await usersCollection.insertOne(this)
    return this
  }
}

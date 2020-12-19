import { usersCollection } from '../mongo.ts'

interface IUser {
  _id: string,
  email: string,
  password: string,
  name: string
}

export default class User implements IUser {
  public _id: any
  public email: string
  public password: string
  public name: string

  constructor ({ _id = '', email = '', password = '', name = '' }) {
    this._id = _id
    this.email = email
    this.password = password
    this.name = name
  }

  static isUser (user: unknown): user is User {
    return typeof user == 'object'
      && user !== null
      && '_id' in user
      && 'email' in user
      && 'password' in user
      && 'name' in user
  }

  static async findOne (params: object): Promise<User | null> {
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

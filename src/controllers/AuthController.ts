import { RouterContext, bcrypt, JWT, oak } from '../../dependencies.ts'
import User from '../models/User.ts'

class AuthController {
  async login (context: RouterContext) {
    const value = await context.request.body().value
    const args = Object.fromEntries(value)
    if (!args.email || !args.password) {
      context.response.status = 406
      context.response.body = { message: 'Invalid' }
      return
    }

    const user = await User.findOne({ email: args.email })
    if (!user) {
      context.response.status = 406
      context.response.body = { message: 'Invalid' }
      return
    }

    const result = await bcrypt.compare(args.password, user.password)
    if (result) {
      const payload: JWT.Payload = {
        iss: 'deno',
        aud: 'user',
        iat: JWT.getNumericDate(new Date()),
        exp: JWT.getNumericDate(3600),
        _id: user._id
      }
      const header: JWT.Header = {
        alg: 'HS512',
        typ: 'JWT'
      }
      const jwt = await JWT.create(header, payload, Deno.env.get('JWT_SECRET') || 'secret')
      const cookie = new oak.Cookies(context.request, context.response)
      cookie.set('JWT', jwt)
      context.response.body = { id: user._id, name: user.name }
    }
  }

  async register (context: RouterContext) {
    const value = await context.request.body().value
    const args = Object.fromEntries(value)
    let user = await User.findOne(args.email)

    if (user) {
      context.response.status = 406
      context.response.body = { message: 'Email taken' }
      return
    }

    const hash = await bcrypt.hash(args.password)
    user = await new User({ ...args, password: hash }).register()
    context.response.status = 200
    context.response.body = { _id: user._id, name: user.name }
  }
}

export default new AuthController()

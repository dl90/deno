import { RouterContext, bcrypt, JWT, dotenv } from '../dependencies.ts'
import User from "../models/User.ts"

class AuthController {
  async login(context: RouterContext) {
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
        user: {
          id: user._id,
          name: user.name
        }
      }

      const header: JWT.Header = {
        alg: "HS512",
        typ: "JWT"
      }

      const jwt = await JWT.create(header, payload, Deno.env.get('JWT_SECRET') || 'secret')
      context.response.body = { id: user._id, name: user.name, jwt }
    }
  }

  async register(context: RouterContext) {
    const value = await context.request.body().value
    const args = Object.fromEntries(value)
    const user = await User.findOne({ email: args.email })

    if (user) {
      context.response.status = 406
      context.response.body = { message: 'Email taken' }
      return
    } else {
      const hash = await bcrypt.hash(args.password)
      const user = await new User({ ...args, password: hash }).register()
      context.response.status = 200
      context.response.body = { _id: user._id, name: user.name }
    }

  }
}

export default new AuthController()
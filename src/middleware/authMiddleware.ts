import { RouterContext, JWT, Bson } from '../../dependencies.ts'
import User from '../models/User.ts'

export default async function authMiddleware (context: RouterContext, next: Function) {
  const headers = context.request.headers
  const authZHeader = headers.get('Authorization')
  if (!authZHeader) {
    context.response.status = 401
    return
  }

  const jwt = authZHeader.split(' ')[1]
  if (!jwt) {
    context.response.status = 401
    return
  }

  try {
    const payload = await JWT.verify(jwt, Deno.env.get('JWT_SECRET') || 'secret', 'HS512')

    if (payload) {
      const _id = { _id: new Bson.ObjectID(payload?._id) }
      const user = await User.findOne(_id)
      context.state.user = user
      await next()
    }
  } catch (e) {
    context.response.status = 401
    return
  }
}

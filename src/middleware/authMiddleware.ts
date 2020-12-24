import { RouterContext, JWT, Bson, oak } from '../../dependencies.ts'
import User from '../models/User.ts'

export default async function authMiddleware (context: RouterContext, next: Function) {
  const cookies = new oak.Cookies(context.request, context.response)
  let token = cookies.get('JWT')

  if (token) {
    const user = await verify(token)
    if (user) {
      user.password = '****'
      context.state.user = user
      await next()
    } else {
      context.response.status = 401
      context.response.body = { message: 'Invalid || Expired JWT' }
    }
    return

  } else {
    const headers = context.request.headers
    const authZHeader = headers.get('Authorization')
    if (!authZHeader) {
      context.response.status = 401
      return
    }

    token = authZHeader.split(' ')[1]
    if (!token) {
      context.response.status = 401
      return
    }

    const user = await verify(token)
    if (user) {
      context.state.user = user
      await next()
    } else context.response.status = 401
    return
  }
}

async function verify (jwt: string) {
  try {
    const payload = await JWT.verify(jwt, Deno.env.get('JWT_SECRET') || 'secret', 'HS512')
    if (!payload) return null
    return User.findOne({ _id: new Bson.ObjectID(payload?._id) })
  } catch (e) {
    console.log(e.message)
    return null
  }
}

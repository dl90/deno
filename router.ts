import { Router, RouterContext } from './dependencies.ts'

const router = new Router()


router.get('/', (ctx: RouterContext) => {
  ctx.response.body = 'Hi'
})

export default router

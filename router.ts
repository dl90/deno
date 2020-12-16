import { Router, RouterContext } from './dependencies.ts'
import AuthController from './controllers/AuthController.ts'

const router = new Router()


router.get('/', (context: RouterContext) => {
  context.response.body = 'Hi'
})

router.post('/api/v1/login', AuthController.login)
router.post('/api/v1/register', AuthController.register)

export default router

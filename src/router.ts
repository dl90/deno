import { Router, RouterContext } from '../dependencies.ts'
import authMiddleware from './middleware/authMiddleware.ts'
import AuthController from './controllers/AuthController.ts'
import SurveyController from './controllers/SurveyController.ts'

const router = new Router()

// home
router.get('/', (context: RouterContext) => { context.response.body = 'Hi' })

// auth
router.post('/api/v1/login', AuthController.login)
router.post('/api/v1/register', AuthController.register)

// survey
router.get('/api/v1/survey', authMiddleware, SurveyController.getAllUsers.bind(SurveyController))
router.get('/api/v1/survey/:id', authMiddleware, SurveyController.getOne.bind(SurveyController))
router.post('/api/v1/survey', authMiddleware, SurveyController.create.bind(SurveyController))
router.patch('/api/v1/survey/:id', authMiddleware, SurveyController.update.bind(SurveyController))
router.delete('/api/v1/survey/:id', authMiddleware, SurveyController.delete.bind(SurveyController))

export default router

import { oak } from '../dependencies.ts'
import authMiddleware from './middleware/authMiddleware.ts'
import ViewController from './controllers/ViewController.ts'
import AuthController from './controllers/AuthController.ts'
import SurveyController from './controllers/SurveyController.ts'
import QuestionController from './controllers/QuestionController.ts'

const router = new oak.Router()
const API = '/api/v1'

export enum ParamIDs {
  SURVEY = 'surveyID',
  QUESTION = 'questionID'
}

// view
router.get('/', ViewController.surveys)
router.get(`/survey/:${ParamIDs.SURVEY}`, ViewController.viewSurvey)
router.post(`/survey/:${ParamIDs.SURVEY}`, ViewController.submitSurvey)

// auth
router.post(`${API}/login`, AuthController.login)
router.post(`${API}/register`, AuthController.register)

// survey
router.get(`${API}/survey`, authMiddleware, SurveyController.getAllByUsers.bind(SurveyController))
router.get(`${API}/survey/:${ParamIDs.SURVEY}`, authMiddleware, SurveyController.getOne.bind(SurveyController))
router.post(`${API}/survey`, authMiddleware, SurveyController.create.bind(SurveyController))
router.patch(`${API}/survey/:${ParamIDs.SURVEY}`, authMiddleware, SurveyController.update.bind(SurveyController))
router.delete(`${API}/survey/:${ParamIDs.SURVEY}`, authMiddleware, SurveyController.delete.bind(SurveyController))

// questions
router.get(`${API}/survey/:${ParamIDs.SURVEY}/questions`, authMiddleware, QuestionController.getAllBySurvey.bind(QuestionController))
router.get(`${API}/question/:${ParamIDs.QUESTION}`, authMiddleware, QuestionController.getOne.bind(QuestionController))
router.post(`${API}/question/:${ParamIDs.SURVEY}`, authMiddleware, QuestionController.create.bind(QuestionController))
router.patch(`${API}/question/:${ParamIDs.QUESTION}`, authMiddleware, QuestionController.update.bind(QuestionController))
router.delete(`${API}/question/:${ParamIDs.QUESTION}`, authMiddleware, QuestionController.delete.bind(QuestionController))

export default router

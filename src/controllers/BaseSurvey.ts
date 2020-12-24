import { RouterContext, Bson } from '../../dependencies.ts'
import { ParamIDs } from '../router.ts'
import Survey from '../models/Survey.ts'
import Question from '../models/Question.ts'
import User from '../models/User.ts'

export default abstract class BaseSurvey {

  protected async findOneSurveyByParams (context: RouterContext, verify: boolean): Promise<Survey | null> {
    const id = context.params[ParamIDs.SURVEY]
    if (!id) {
      context.response.status = 404
      context.response.body = { message: 'Incorrect ID' }
      return null
    }

    const survey = await Survey.findByID(id)
    if (!survey) {
      context.response.status = 404
      context.response.body = { message: 'Not Found' }
      return null
    }

    if (verify) {
      const user = context.state.user as User
      const userID = new Bson.ObjectID(user._id)
      const surveyUserID = new Bson.ObjectID(survey.userID)

      if (!userID.equals(surveyUserID)) {
        context.response.status = 403
        context.response.body = { message: 'Forbidden' }
        return null
      }
    }
    return survey
  }

  protected async findOneQuestionByParams (context: RouterContext, verify: boolean): Promise<Question | null> {
    const id = context.params[ParamIDs.QUESTION]
    if (!id) {
      context.response.status = 404
      context.response.body = { message: 'Incorrect ID' }
      return null
    }

    const question = await Question.findByID(id)
    if (!question) {
      context.response.status = 404
      context.response.body = { message: 'Not Found' }
      return null
    }

    if (verify) {
      const user = context.state.user as User
      const userID = new Bson.ObjectID(user._id)
      const survey = await Survey.findByID(question.surveyID)
      if (!survey) {
        context.response.status = 404
        context.response.body = { message: 'Survey not found' }
        return null
      }

      const surveyUserID = new Bson.ObjectID(survey.userID)
      if (!userID.equals(surveyUserID)) {
        context.response.status = 403
        context.response.body = { message: 'Forbidden' }
        return null
      }
    }
    return question
  }
}

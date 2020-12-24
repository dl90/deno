import { RouterContext } from '../../dependencies.ts'
import BaseSurvey from './BaseSurvey.ts'
import Question from '../models/Question.ts'

class QuestionController extends BaseSurvey {

  async getAllBySurvey (context: RouterContext) {
    const survey = await this.findOneSurveyByParams(context, false)
    if (survey) {
      const questions = await Question.findBySurvey(survey._id)
      context.response.body = questions
    }
  }

  async getOne (context: RouterContext) {
    const q = await this.findOneQuestionByParams(context, false)
    if (q) context.response.body = q
    else {
      context.response.status = 404
      context.response.body = { message: 'Not found' }
    }
  }

  async create (context: RouterContext) {
    const survey = await this.findOneSurveyByParams(context, true)
    const { question, type, required, data } = await context.request.body().value

    if (survey) {
      let q = new Question(survey._id, question, type, required, data)
      q = await q.create()
      if (q._id) {
        context.response.status = 201
        context.response.body = q
      } else {
        context.response.status = 500
        context.response.body = { message: 'Failed to insert to database' }
      }
    }
  }

  async update (context: RouterContext) {
    const q = await this.findOneQuestionByParams(context, true)
    if (q) {
      const { question, type, required, data } = await context.request.body().value
      const updated = await q.update(question ?? q.question, type ?? q.type, required ?? q.required, data ?? q.data)
      context.response.body = updated ? q : { message: 'Update failed' }
      return
    }
    context.response.status = 404
    context.response.body = { message: 'Not found' }
  }

  async delete (context: RouterContext) {
    const q = await this.findOneQuestionByParams(context, true)
    if (q) {
      const delCount = await q.delete()
      if (delCount === 1) context.response.status = 204
      else {
        context.response.status = 500
        context.response.body = { message: 'Delete error' }
      }
      return
    }
    context.response.status = 404
    context.response.body = { message: 'Not found' }
  }
}

export default new QuestionController()
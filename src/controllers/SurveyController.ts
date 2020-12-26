import { RouterContext } from '../../dependencies.ts'
import BaseSurvey from './BaseSurvey.ts'
import Survey from '../models/Survey.ts'
import User from '../models/User.ts'

class SurveyController extends BaseSurvey {

  async getAllByUsers (context: RouterContext) {
    const user = context.state.user as User
    const result = await Survey.findByUser(user._id)
    context.response.body = result
  }

  async getOne (context: RouterContext) {
    const survey = await this.findOneSurveyByParams(context, false)
    if (survey) context.response.body = survey
    else {
      context.response.status = 404
      context.response.body = { message: 'Not found' }
    }
  }

  async create (context: RouterContext) {
    const user = context.state.user as User
    const { name, desc } = await context.request.body().value
    let survey = new Survey(user._id, name, desc)

    survey = await survey.create()
    if (survey._id) {
      context.response.status = 201
      context.response.body = survey
    } else {
      context.response.status = 500
      context.response.body = { message: 'Failed to insert to database' }
    }
  }

  async update (context: RouterContext) {
    const survey = await this.findOneSurveyByParams(context, true)
    if (survey) {
      const { name, desc } = await context.request.body().value
      const updated = await survey.update(name ?? survey.name, desc ?? survey.desc)
      context.response.body = updated ? survey : { message: 'Update failed' }
      return
    }
    context.response.status = 404
    context.response.body = { message: 'Not found' }
  }

  async delete (context: RouterContext) {
    const survey = await this.findOneSurveyByParams(context, true)
    if (survey) {
      const delCount = await survey.delete()
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

export default new SurveyController()

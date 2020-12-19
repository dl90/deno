import { RouterContext } from '../../dependencies.ts'
import Survey from '../models/Survey.ts'
import User from '../models/User.ts'

class SurveyController {

  private async parseParamsIDAndFindOne (context: RouterContext, verify: boolean): Promise<Survey | null> {
    const surveyID = context.params.id
    if (!surveyID) {
      context.response.status = 404
      context.response.body = { message: 'Incorrect ID' }
      return null
    }

    const survey = await Survey.findByID(surveyID)
    if (!survey) {
      context.response.status = 404
      context.response.body = { message: 'Not Found' }
      return null
    }

    if (verify) {
      const user = context.state.user as User
      if (survey && survey.userID !== user._id) {
        context.response.status = 403
        context.response.body = { message: 'Forbidden' }
        return null
      }
    }

    return survey
  }

  async getAllUsers (context: RouterContext) {
    const user = context.state.user as User
    const result = await Survey.findByUser(user._id)
    context.response.body = result
  }

  async getOne (context: RouterContext) {
    const survey = await this.parseParamsIDAndFindOne(context, false)
    if (survey) context.response.body = survey
  }

  async create (context: RouterContext) {
    const user = context.state.user as User
    const { name, desc } = await context.request.body().value
    const survey = new Survey(user._id, name, desc)

    await survey.create()
    context.response.status = 201
    context.response.body = survey
  }

  async update (context: RouterContext) {
    const survey = await this.parseParamsIDAndFindOne(context, true)
    if (survey) {
      const { name, desc } = await context.request.body().value
      const update = await survey.update(name, desc)
      context.response.body = update ? survey : { message: 'Update failed' }
      return
    }
  }

  async delete (context: RouterContext) {
    const survey = await this.parseParamsIDAndFindOne(context, true)
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
    return
  }
}

export default new SurveyController()

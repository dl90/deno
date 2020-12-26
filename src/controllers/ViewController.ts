import { RouterContext, dejs } from '../../dependencies.ts'
import { ParamIDs } from '../router.ts'
import Survey from '../models/Survey.ts'
import Question from '../models/Question.ts'
import { answersCollection } from '../mongo.ts'

class ViewController {

  private static render (view: string, params: object = {}) {
    return dejs.renderFileToString(`${Deno.cwd()}/src/views/${view}`, params)
  }

  async surveys (context: RouterContext) {
    const surveys = await Survey.findAll()
    context.response.body = await ViewController.render('surveys.ejs', { surveys })
  }

  async viewSurvey (context: RouterContext) {
    const surveyID = context.params[ParamIDs.SURVEY]
    if (surveyID) {
      const survey = await Survey.findByID(surveyID)
      if (!survey) {
        context.response.body = await ViewController.render('notfound.ejs')
        return
      }

      const questions = await Question.findBySurvey(surveyID)
      context.response.body = await ViewController.render('questions.ejs', { survey, questions, answers: {}, errors: {} })
      return
    }
    context.response.body = await ViewController.render('notfound.ejs')
  }

  async submitSurvey (context: RouterContext) {
    const surveyID = context.params[ParamIDs.SURVEY]
    if (surveyID) {
      const survey = await Survey.findByID(surveyID)
      if (!survey) {
        context.response.body = await ViewController.render('notfound.ejs')
        return
      }

      const questions = await Question.findBySurvey(surveyID)
      const values: URLSearchParams = await context.request.body().value
      const errors: any = {}
      const answers: any = {}

      for (const question of questions) {
        const answer: string | string[] | null = question.isMulti() && question.data.multiple
          ? values.getAll(question._id)
          : values.get(question._id)
        answers[question._id] = answer

        if (question.required) {
          if (!answer || answer === null || (question.isMulti() && question.data.multiple && !answer.length)) {
            errors[question._id] = 'Missing'
          }
        }
      }

      if (Object.keys(errors).length) {
        context.response.body = await ViewController.render('questions.ejs', { survey, questions, answers, errors })
        return
      }

      await answersCollection.insert({ surveyID, date: new Date(), answers })
      context.response.body = 'Success'
      return
    }

    context.response.status = 404
    context.response.body = { message: 'Not found' }
  }
}

export default new ViewController()

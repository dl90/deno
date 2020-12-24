import { RouterContext, dejs } from '../../dependencies.ts'
import { ParamIDs } from '../router.ts'
import Survey from '../models/Survey.ts'
import Question from '../models/Question.ts'

class ViewController {

  async surveys (context: RouterContext) {
    const surveys = await Survey.findAll()
    context.response.body = await dejs.renderFileToString(`${Deno.cwd()}/src/views/surveys.ejs`, { surveys })
  }

  async viewSurvey (context: RouterContext) {
    const surveyID = context.params[ParamIDs.SURVEY]
    if (surveyID) {
      const questions = await Question.findBySurvey(surveyID)
      console.log(questions)
      context.response.body = await dejs.renderFileToString(`${Deno.cwd()}/src/views/questions.ejs`, { questions })
    }
  }
}

export default new ViewController()

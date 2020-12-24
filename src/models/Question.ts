import { Bson } from '../../dependencies.ts'
import { questionsCollection } from '../mongo.ts'

export enum QuestionTypes {
  MULTIPLE = 'multi-choice',
  BOOLEAN = 'boolean',
  BLANK = 'fill-blank'
}

export default class Question {
  _id: any

  constructor (
    public surveyID: string,
    public question: string,
    public type: QuestionTypes,
    public required: boolean,
    public data: any) { }

  private static parse (object: any): Question {
    const question = new Question(object.surveyID, object.question, object.type, object.required, object.data)
    question._id = object._id
    return question
  }

  static isQuestion (question: unknown): question is Question {
    return typeof question === 'object'
      && question !== null
      && question.hasOwnProperty('_id')
      && question.hasOwnProperty('surveyID')
      && question.hasOwnProperty('question')
      && question.hasOwnProperty('type')
      && question.hasOwnProperty('required')
      && question.hasOwnProperty('data')
  }

  static async findBySurvey (surveyID: string): Promise<Question[]> {
    const cursor = await questionsCollection.find({ surveyID })
    const results = await cursor.toArray()
    return results.filter(this.isQuestion).map(v => this.parse(v))
  }

  static async findByID (questionID: string): Promise<Question | null> {
    const question = await questionsCollection.findOne({ _id: new Bson.ObjectID(questionID) })
    return this.isQuestion(question)
      ? this.parse(question)
      : null
  }

  async create (): Promise<Question> {
    this._id = await questionsCollection.insertOne(this)
    return this
  }

  async update (question: string, type: QuestionTypes, required: boolean, data: any): Promise<Question | false> {
    const { matchedCount, modifiedCount } = await questionsCollection.updateOne(
      { _id: new Bson.ObjectID(this._id) },
      { $set: { question, type, required, data } }
    )

    if (matchedCount === 1 && modifiedCount === 1) {
      this.question = question
      this.type = type
      this.required = required
      this.data = data
      return this
    } else if (matchedCount) {
      return this
    }
    return false
  }

  delete (): Promise<number> {
    return questionsCollection.deleteOne({ _id: new Bson.ObjectID(this._id) })
  }
}

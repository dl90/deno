import { Bson } from '../../dependencies.ts'
import { questionsCollection } from '../mongo.ts'

export enum QuestionTypes {
  MULTIPLE = 'multi',
  BOOLEAN = 'boolean',
  TEXT = 'text'
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

  private static parseID (_id: string | Bson.ObjectID) {
    try {
      return new Bson.ObjectID(_id)
    } catch (e) {
      return null
    }
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
    const cursor = await questionsCollection.find({ surveyID: Question.parseID(surveyID) })
    const results = await cursor.toArray()
    return results.filter(this.isQuestion).map(v => Question.parse(v))
  }

  static async findByID (questionID: string): Promise<Question | null> {
    const question = await questionsCollection.findOne({ _id: Question.parseID(questionID) })
    return this.isQuestion(question)
      ? Question.parse(question)
      : null
  }

  async create (): Promise<Question> {
    this._id = await questionsCollection.insertOne(this)
    return this
  }

  async update (question: string, type: QuestionTypes, required: boolean, data: any): Promise<Question | false> {
    const { matchedCount, modifiedCount } = await questionsCollection.updateOne(
      { _id: Question.parseID(this._id) },
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
    return questionsCollection.deleteOne({ _id: Question.parseID(this._id) })
  }

  isText() {
    return this.type === QuestionTypes.TEXT
  }

  isMulti() {
    return this.type === QuestionTypes.MULTIPLE
  }

  isBoolean() {
    return this.type === QuestionTypes.BOOLEAN
  }
}

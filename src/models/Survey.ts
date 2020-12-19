import { Bson } from '../../dependencies.ts'
import { surveysCollection } from '../mongo.ts'

interface ISurvey {
  _id?: string,
  userID: string,
  name: string,
  desc: string
}

export default class Survey implements ISurvey {
  public _id: any
  public userID: string
  public name: string
  public desc: string

  constructor (userID: string, name: string, desc: string) {
    this.userID = userID
    this.name = name
    this.desc = desc
  }

  private static parse (obj: any): Survey {
    const survey = new Survey(obj.userID, obj.name, obj.desc)
    survey._id = obj._id
    return survey
  }

  static isSurvey (survey: unknown): survey is Survey {
    return typeof survey === 'object'
      && survey !== null
      && '_id' in survey
      && 'userID' in survey
      && 'name' in survey
      && 'desc' in survey
  }

  static async findByUser (userID: string): Promise<Survey[]> {
    const cursor = surveysCollection.find({ userID })
    const result = await cursor.toArray()
    const parsed = result.filter(val => this.isSurvey(val)).map(val => this.parse(val))
    return parsed
  }

  static async findByID (surveyID: string): Promise<Survey | null> {
    const survey = await surveysCollection.findOne({ _id: new Bson.ObjectID(surveyID) })
    return this.isSurvey(survey)
      ? this.parse(survey)
      : null
  }

  async create (): Promise<Survey> {
    this._id = await surveysCollection.insertOne(this)
    return this
  }

  async update (name: string, desc: string): Promise<Survey | false> {
    const { matchedCount, modifiedCount } = await surveysCollection.updateOne(
      { _id: new Bson.ObjectID(this._id) },
      { $set: { name, desc } }
    )

    if (matchedCount === 1 && modifiedCount === 1) {
      this.name = name
      this.desc = desc
      return this
    } else if (matchedCount) {
      return this
    }
    return false
  }

  delete (): Promise<number> {
    return surveysCollection.deleteOne({ _id: new Bson.ObjectID(this._id) })
  }
}

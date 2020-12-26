import { oak } from '../../dependencies.ts'
import { fileExists } from '../util.ts'

const STATIC_PATH = `${Deno.cwd()}/src/static`

export async function staticMiddleware (context: oak.Context, next: Function) {
  if (await fileExists(STATIC_PATH + context.request.url.pathname)) {
    await oak.send(context, context.request.url.pathname, {
      root: STATIC_PATH,
      // index: "index.html",
    })
  } else {
    await next()
  }
}

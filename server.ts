import { oak, dotenv } from './dependencies.ts'
import { staticMiddleware } from './src/middleware/staticMiddleware.ts'
import router from './src/router.ts'

const app = new oak.Application()
dotenv.config({ export: true })

app.use(router.routes())
app.use(router.allowedMethods())
app.use(staticMiddleware)
app.addEventListener('listen', e => console.log('http://localhost:' + e.port))
app.addEventListener('error', e => console.log(e.error))

await app.listen({ port: 8080 })

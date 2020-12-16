import { Application, dotenv } from './dependencies.ts'
import router from './router.ts'

const app = new Application()
dotenv.config({ export: true })

app.use(router.routes())
app.use(router.allowedMethods())
app.addEventListener('listen', e => console.log('http://localhost:' + e.port))

await app.listen({ port: 8080 })

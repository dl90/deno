import { Application, Router, RouterContext } from './dependencies.ts'
import router from './router.ts'

const app = new Application()

app.use(router.routes())
app.use(router.allowedMethods())
app.addEventListener('listen', e => console.log('http://localhost:' + e.port))

await app.listen({ port: 8080 })
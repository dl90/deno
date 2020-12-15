export { }

// --allow-read=./
console.log(Deno.cwd())
console.log(await Deno.readTextFile('./access.ts'))

// --allow-write=./
const encoder = new TextEncoder()
await Deno.writeFile('./test.js', encoder.encode('console.log(\'hello world\')'))
await Deno.remove('./test.js')

// --allow-env
console.log(Deno.env.get('PATH'), "\n")

// --allow-net=www.google.ca
const res = await fetch('https://www.google.ca')
console.log({ res })

// deno install <file name> -n <name>
// setTimeout(() => console.log('brrrrrrr'), 4000)

// deno run --reload (reloads cached packages)
for await (const dir of Deno.readDir('/')) console.log(dir)

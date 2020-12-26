export async function fileExists (filename: string) {
  try {
    const fileStats = await Deno.lstat(filename)
    return fileStats && fileStats.isFile
  } catch (e) {
    if (e && e instanceof Deno.errors.NotFound) return false
    console.log(e.message)
  }
}

import fs from "fs"
import path from "path"
import assert from "assert"
import dotenv from "dotenv"

const file = ".env"
let env = path.join(process.cwd(), file)
let last = env
while (!fs.existsSync(env)) {
	const parent = path.dirname(path.dirname(env))
	env = path.join(parent, file)
	assert(env != last)
	last = env
}
dotenv.config({ path: env })
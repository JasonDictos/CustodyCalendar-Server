import fs from "fs"
import os from "os"
import path from "path"

export function testPath(file?: string) {
	const p = path.join(os.tmpdir(), Date.now().toString(16))
	fs.mkdirSync(p)
	if (file)
		return path.join(p, file)
	return p
}

export function randomString(length) {
	let result = ""
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	const charactersLength = characters.length
	for (let i = 0; i < length; i++)
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	return result
}


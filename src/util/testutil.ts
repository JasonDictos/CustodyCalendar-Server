import fs from 'fs';
import os from 'os';
import path from 'path';

export function testPath(file?: string) {
	const p = path.join(os.tmpdir(), Date.now().toString(16))
	fs.mkdirSync(p);
	if (file)
		return path.join(p, file);
	return p;
}

export function randomString(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++)
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	return result;
 }

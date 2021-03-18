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
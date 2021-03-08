const commonUtils: any[] = [];
const utils: { [k: string]: any } = {};

for (const i in commonUtils) {
	utils[i] = commonUtils[i];
}

export default utils;

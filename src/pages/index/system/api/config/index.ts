import debug from "./debug";
import release from "./release";

let config: { [k: string]: any } = {};
const mode: string = "debug";

switch (mode) {
	case "debug":
		config = debug;
		break;
	case "release":
		config = release;
		break;
	default:
		config = {};
		console.error("错误的配置");
		break;
}

export default config;

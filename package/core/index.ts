import { DefautsConfig } from './courier/courier';
import tasks from './task';
import cach from './cach';
import mergeConfig from '../utils/mergeConfig';



class Courier {
  public defaults: DefautsConfig;
  public tasks: any[];
  public cach: { [k: string]: any };

  
  /** Nomral constructor */
  public constructor(config: DefautsConfig) {
    config = config || {};
    config.headers = config.headers || {};
    this.tasks = tasks.tasksProxy;
    this.cach = cach.cachProxy;
    this.defaults = mergeConfig(config);
  }
}

export default Courier;
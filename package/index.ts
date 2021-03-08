import Courier from './core/index';  
import tasks from './core/task';
import cach from './core/cach';

// export interface defaultsType {
//   tasks: any;
//   cach: any;
//   create(config: DefautsConfig): any;
// }

const courier = {
  tasks: tasks.tasksProxy,
  cach: cach.cachProxy,
  // create: function (config = {}) {
  //   return new courier(config);
  // },
};

export default courier;

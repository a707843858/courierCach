import courierCach from './packages';
// import { CFetch as ff, CRequest } from './packages/polyfill';

const courier = new courierCach({
  timeout: 1000 * 60,
  expires: 1000 * 60,
  cacheType: 'cacheStorage',
});


// courier.useRequestIntercept((config) => {
// console.log('config', config);
// return config;
// });

// const a = new Headers();
// a.set('a', 'a')
// a.append('a', 'b');
// a.forEach((name, key) => {

// })

// http://192.168.110.241:10011/dev-gdznyw-consumer/owner
// fetch('http://192.168.110.241:10011/dev-gdznyw-consumer/owner').then(async (res) => {
// console.log( await res.json(),'lll');
// });

courier
  .fetch('http://192.168.110.241:10011/dev-gdznyw-consumer/owner', {
    expires: 60000 * 1,
    params: { a: 1 },
    method: 'get',
    headers: { b: '2' },
  })
  .then(async (res) => {
    //
    // courier.task.queue.set('http://192.168.110.241:10011/dev-gdznyw-consumer/owner,GET,','a');
    // console.log(courier.task.queue.get('http://192.168.110.241:10011/dev-gdznyw-consumer/owner,GET,'), 'task');
    // a.put('flowers.jpg', res);
    // console.info(res.json(), 'data');
    // courier.cacheType = 'aa';
    // const b = res.json();
    // courier.cache.forEach((name, value, arr) => {
    // 	console.log(name, value, arr);
    // });
    console.log(res, 'res');
    console.log(courier, 'nnnn');
  })
  .catch((err) => {
    console.log(err, 'n');
  });

// setTimeout(() => {
//   courier
//     .useFetch('http://192.168.110.241:10011/dev-gdznyw-consumer/owner', {
//       expires: 60000 * 1,
//       params: { a: 1 },
//       method: 'get',
//       headers: { a: '1' },
//     })
//     .then(async (res) => {
//       //
//       // courier.task.queue.set('http://192.168.110.241:10011/dev-gdznyw-consumer/owner,GET,','a');
//       // console.log(courier.task.queue.get('http://192.168.110.241:10011/dev-gdznyw-consumer/owner,GET,'), 'task');
//       // a.put('flowers.jpg', res);
//       // console.info(res.json(), 'data');
//       // courier.cacheType = 'aa';
//       // const b = res.json();
//       // courier.cache.forEach((name, value, arr) => {
//       // console.log(name, value, arr);
//       // });
//       console.log(res, await res.json(), 'nnnn44');
//     })
//     .catch((err) => {
//       console.log(err, 'n');
//     });
// }, 1000 * 5);

export default {};

<h1 align="center"><center>courierCach</center></H1>

<center>一个高效便捷的前端Fetch缓存插件</center>

# Descript

随着前端业务发展的迅速，业务和项目越来越复杂，接口联动和复杂度越来越高。为了减少请求响应，减少不必要的等待，减少接口联动交互的时间，前端需要对频繁，变动量少的接口做缓存，增加响应速度。该插件特点：架构
单一性，读写权限合理化，隐藏数据源，使用 Fetch 获取资源，基于 Promise 进行封装,优先使用cacheStorage，次选Map内存存储。

&emsp;

# Getting started

使用 courierCach 首先需要实例化：

```JavaScript
import courierCach from ' courier-cach';

//默认属性也可以通过 courier.defaults.xxx = yyy 定义;

const  courier = new  courierCach({

  //baseUrl 将添加到 Url前面作为基本路径,类型:string,默认值:'';
  baseUrl:'http://xxx.com',

  //请求超时时间(单位为 ms),类型:number，默认值:0;
  timeout:

  // 缓存有效时间(单位为 ms)，不设置时间则不缓存,类型:number,默认值:0
  expires:6000 * 1 ,

  //期待返回类型,可选值:textarrayBuffer、blob、formData,类型:string,默认值:'json';
  responseType:'json',

  //请求凭证,可选值:omit,类型:string,默认值:include;
  credentials:'include',

  //请求头,类型:object,默认值:{}
  header:{
    //分别为每个方法定义公共请求头
    COMMON:{
      //.....
    },
    POST:{
      //....
    }
    //....
  }

  //请求跨域,可选值:no-cors, same-origin,类型:string,默认值:'cors';
  cors:'cors',

  //请求重定向,可选值:manual, error,类型:string,默认值:'follow';
  redirect:'follow',


  //请求来源,可选值:no-referrer,类型:string,默认值:'client';
  referrer:'client',

  //缓存协议,可选值:no-cache, reload, force-cache, only-if-cached,类型:string,默认是值:'default';
  cache:'default',

});
```

&emsp;

## 响应结构

```Javascript
//请求响应结构
{
  //请求响应返回的可读取的二进制流
  body:ReadableStream,

  //响应二进制流是否已被读取
  bodyUsed:true,

  //期待返回类型的数据,根据responsetype对响应二进制流进行读取转换
  data:{},

  //请求响应头
  headers:{
    '_expirese':6000,//请求缓存时间
    '_expirationTime':1618215453000,//缓存过期时间
    //......
  },

  //请求是否成功
  ok:true,

  //请求是否发生过跳转
  redirected:false,

  //请求状态码
  status:200,

  //状态响应信息
  statusText:"",

  //类型
  type:'default',

  //请求路径
  url:'http://a.com',

}

```

## Api

&emsp;

为了确保稳定性和统一性，请勿存储流式数据。

同时为了方便使用，也为其他方法提供了别名,其他请求参考 fetch。

```Javascript
  courier.fetch(
    'http"//a.com/getUser',
    {
      method: 'POST',
      body:{
        name:'Joe',
      }
    }
  ).then(res=>{

    // 请求响应数据处理....

  }).catch(err=>{

    //请求响应错误处理....

  })
```

- fetch ( url : string , apiOption : object ) : Promise\<Response>

- get ( url : string , apiOption : object ) : Promise\<Response>

- post ( url : string , apiOption : object ) : Promise\<Response>

- delete ( url : string , apiOption : object ) : Promise\<Response>

- head ( url : string , apiOption : object ) : Promise\<Response>

- options ( url : string , apiOption : object ) : Promise\<Response>

- post ( url : string , apiOption : object ) : Promise\<Response>

- put ( url : string , apiOption : object ) : Promise\<Response>

- patch ( url : string , apiOption : object ) : Promise\<Response>

&emsp;

## 拦截器

```JavaScript
  //添加请求前拦截器
  courier.interceptRequest((config)=>{
    //请求前处理....
    return config;
  },(err)=>{
    //请求前错误处理...
    return err;
  });

  //添加响应拦截器
  courier.interceptResponse((response)=>{
    //请求响应后处理...
    return response;
  },(err)=>{
    //请求响应后错误处理...
    return err;
  });
```

&emsp;

# Issues

希望大家使用后有什么建议多提，一起共同进步。

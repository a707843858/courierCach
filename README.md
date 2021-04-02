<h1 align="center"><center>courierCach</center></H1>

<center>一个高效便捷的前端Fetch缓存插件</center>

# Descript

随着前端业务发展的迅速，业务和项目越来越复杂，接口联动和复杂度越来越高。为了减少请求响应，减少不必要的等待，减少接口联动交互的时间，前端需要对频繁，变动量少的接口做缓存，增加响应速度。该插件特点：架构
单一性，读写权限合理化，隐藏数据源，使用 Fetch 获取资源，基于 Promise 进行封装。

&emsp;

# Getting started

使用 courierCach 首先需要实例化：

```JavaScript
import courierCach from ' courier-cach';
const  courier = new  courierCach(<option>);
```

&emsp;

## Option

| 属性         | 说明                                                   | 类型   | 默认值    |
| ------------ | ------------------------------------------------------ | ------ | --------- |
| baseUrl      | 路径前缀                                               | string | -         |
| expires      | 缓存有效时间(单位为 ms)，不设置时间则不缓存            | number | 0         |
| timeout      | 请求超时时间                                           | number | 0         |
| responseType | 返回类型,可选值 text 、arrayBuffer 、 blob 、 formData | string | 'json'    |
| credentials  | 请求凭证,可选值 omit 、include                         | string | 'include' |

&emsp;

## Api

为了确保稳定性和统一性，请勿存储流式数据。

同时为了方便使用，也为其他方法提供了别名。

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

## apiOption

| 属性        | 说明                              | 类型   | 默认值        |
| ----------- | --------------------------------- | ------ | ------------- |
| body        | 请求参数                          | any    | -             |
| credentials | 请求凭证,可选值 omit 、include    | string | 'same-origin' |
| headers     | 请求头                            | object | {}            |
| method      | 请求方式                          | string | 'GET'         |
| mode        | 请求模式,可选值 no-cors 、 cors   | string | 'same-origin' |
| redirect    | 请求重定向,可选值 manual 、 error | string | 'follow'      |
| referrer    | 请求来源,可选值 no-referrer       | string | 'client'      |

&emsp;

# Issues

希望大家使用后有什么建议多提，一起共同进步。

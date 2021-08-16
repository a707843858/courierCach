const Koa = require('koa');
const router = require('koa-router')(); //注意：引入的方式
var bodyParser = require('koa-bodyparser');
// var cors = require('koa2-cors');
const app = new Koa();
// app.use(cors());
const bodyparser = new bodyParser();
app.use(bodyparser);


router.get( '/', function ( ctx, next ) {
	
	ctx.body = 'Hello koa';
});

router.post( '/api/news', async( ctx, next ) => {
	console.log( ctx.request );
	ctx.body = '新闻page';
});

app.use(router.routes()); //作用：启动路由
// app.use(router.allowedMethods()); // 作用： 这是官方文档的推荐用法,我们可以看到router.allowedMethods()用在了路由匹配router.routes()之后,所以在当所有路由中间件最后调用.此时根据ctx.status设置response响应头
app.listen(3000, () => {
	console.log('starting at port 3000');
});

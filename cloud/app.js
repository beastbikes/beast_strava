// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();
var strava = require('strava-v3');

// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

app.get('/auth', function(req, res) {
	console.log(req.query.code);
	if(!req.query.code){
	  res.render('auth', { message: strava.oauth.getRequestAccessURL({}) });
	}else{
		strava.oauth.getToken(req.query.code, function(err, payload){
			token = payload.access_token;
			firstname = payload.athlete.firstname;
			strava.athlete.listActivities({'access_token':token},function(err, payload){
				res.render('hello', { message: "Hi "+firstname+". found "+payload.length+" riding records!"});
			});
		});
	}
});



// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();
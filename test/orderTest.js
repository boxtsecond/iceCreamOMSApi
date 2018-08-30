var orderArr = [220171117000146,220171117000147,220171117000148,220171117000149,220171117000150,220171117000155,220171117000161,220171117000151,220171117000152,220171117000153,220171117000154,220171117000156,220171117000157,220171117000158,220171117000159,220171117000160,120171117000169,
120171117000171,120171117000173,220171120000207,220171120000208,220171120000209,220171120000212,220171120000218,220171120000220,220171120000221];

var createOrderParamsArr = [
{"goods_sn": "OTMxMzU4MjMzNDY4MjExMjAw","goods_count": 10,"is_digital": 1}, 
{"goods_sn": "OTMxMzU5MTE1Mzg3NzM2MDY0","goods_count": 2,"is_digital": 0}, 
{"goods_sn": "OTMxMzYwMjU2OTE3OTAxMzEy","goods_count": 5,"is_digital": 0},
{"goods_sn": "OTMxMzYwNTI0MzA4OTc1NjE2","goods_count": 4,"is_digital": 0},
{"goods_sn": "OTMxMzYwNzUyNzYwMTMxNTg0","goods_count": 3,"is_digital": 0},
{"goods_sn": "OTMxMzYxMTg3MjQ4MDgyOTQ0","goods_count": 2,"is_digital": 0}];

var testOrderParamsArr = [
{"goods_sn": "931361187248082944","goods_count": 1,"type": "mall"},
{"goods_sn": "931360752760131584","goods_count": 1,"type": "mall"},
{"goods_sn": "931360524308975616","goods_count": 1,"type": "mall"},
{"goods_sn": "931360256917901312","goods_count": 1,"type": "mall"},
{"goods_sn": "931359115387736064","goods_count": 1,"type": "mall"},
{"goods_sn": "000001","goods_count": 1,"type": "system"},
{"goods_sn": "000051","goods_count": 1,"type": "system"},
{"goods_sn": "000050","goods_count": 1,"type": "system"},
{"goods_sn": "000002","goods_count": 1,"type": "system"},
{"goods_sn": "000003","goods_count": 1,"type": "system"},
{"goods_sn": "000004","goods_count": 1,"type": "system"},
{"goods_sn": "003000","goods_count": 1,"type": "system"},
{"goods_sn": "003001","goods_count": 1,"type": "system"},
{"goods_sn": "003002","goods_count": 1,"type": "system"},
{"goods_sn": "001000","goods_count": 1,"type": "recharge"},
{"goods_sn": "001001","goods_count": 1,"type": "recharge"},
{"goods_sn": "001002","goods_count": 1,"type": "recharge"},
{"goods_sn": "001003","goods_count": 1,"type": "recharge"},
{"goods_sn": "001004","goods_count": 1,"type": "recharge"},
{"goods_sn": "001005","goods_count": 1,"type": "recharge"},
{"goods_sn": "111","goods_count": 1,"type": "digital"},
{"goods_sn": "112","goods_count": 1,"type": "digital"},
{"goods_sn": "113","goods_count": 1,"type": "digital"},
{"goods_sn": "114","goods_count": 1,"type": "digital"},
{"goods_sn": "120","goods_count": 1,"type": "digital"},
{"goods_sn": "123","goods_count": 1,"type": "digital"}
];


var tokenArr = [
"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjk5NzEsImV4cCI6MTUxMzEzMDMyMX0.Bk-Fi8zxw4wbPwZhLhL3xiRP9l2Zp2Ujk5ubcE1jgRg",
'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIwNzc0OTUsImV4cCI6MTUxMzkzMDM1M30.cJU3JUKp49UOAETjZ4EHtOGhhU5M_vcIKya_syShukw',
'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIwNzc0OTQsImV4cCI6MTUxMzkzMDM1M30.eboDFtyeGOPvFsmfozdyvxTfGPQzCpiYnc7YNTHwyxc',
'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIwNzc0OTMsImV4cCI6MTUxMzkzMDM1M30.wg3so-CokjwHmP68UTtx1JALXMirdYHYsDkqv1rLmTc',
'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIwNzc0OTIsImV4cCI6MTUxMzkzMDM1M30.PejdUrP6i-v6oXyQDVEepFuyK5O2RgUcjdhUnlcsqFA',
'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIwNzc0OTEsImV4cCI6MTUxMzkzMDM1M30.RKl5mkyDdRArKfaQ5LO9mrNTsQfeb3Y1vkNZwDCnjJg',
'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIwNzc0OTAsImV4cCI6MTUxMzkzMDM1M30.ZZQccV2dA_sOH-vnacZttGB8RlAXXbFcm4FMyukwK5A',
'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIwNzc0ODksImV4cCI6MTUxMzkzMDM1M30.K4G7uv-6Lraj5VXuLQGWSmmCI630F5feDMjpVykuhGQ',
'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIwNzc0ODgsImV4cCI6MTUxMzkzMDM1M30.49UCB7QjQzBZkYW9NleZYB2hjL50AAd6cQepjB-cOI8',
'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIwNzc0ODcsImV4cCI6MTUxMzkzMDM1M30.leZDuXEFdgtR9Hm8zWIhDGqTnxlH6xws6GORQTelCcM',
'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIwNzc0ODYsImV4cCI6MTUxMzkzMDM1M30.q9vfCCIoG3Y2QLHRF7PuzkMBvdGDMvweYA77Zv2Cm6g',
'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjI1NjI1NywiZXhwIjoxNTEzOTMwMzUzfQ.S0POwZRF6H-P3j9D8N3Sz3hhKAJsP39oBHsIvgU4GqA',
'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjI1NjI1NiwiZXhwIjoxNTEzOTMwMzUzfQ.gVmljWZsnfVe7GAIArzCeBfGUVymINyf_YleC7EnZBc',
'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjI1NjI1NSwiZXhwIjoxNTEzOTMwMzUzfQ.dEdrwdMPCiXx3KUoW4xUpgWBXnogUDu_neNb1eA67z0',
'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIxMTExMSwiZXhwIjoxNTEzOTMwMzUzfQ.i55Dsxm5fdrbE-r8QNcfHPPqPDqpRVtLjhUNxDy-xQM',
'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjk5NzQsImV4cCI6MTUxMzkzMDM1M30.gyGe6rfx9m7NyqW57uqFlwErkm0ZdlF44YBz8vGHxbE',
'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjk5NzMsImV4cCI6MTUxMzkzMDM1M30.8q3rlM9O6pdNEjpbhxkwNhPQI4cOuA1zysw4fnlWxMk',
'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjk5NzIsImV4cCI6MTUxMzkzMDM1M30.OJ6zb3YkqoJKlQdkx8QHlgjvhNdpe0tBY4v9nWlz33A',
'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjk5NzEsImV4cCI6MTUxMzkzMDM1M30.kqrU4VJKiUqMspkhccoJB2WtrDDLY_s9F87lXzyCUkw',
'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjk5NjgsImV4cCI6MTUxMzkzMDM1M30.Ol38BixM9ryd920ZJfVYqdYF_ZN8XWeQ2kp2jWYisCw',
'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjk5NjcsImV4cCI6MTUxMzkzMDM1M30.rHQiEBjtpJicmwBktrcJ7hO2Wj8pPSPDyReIJntk4OU'
];

var successOrder = 0;


function getOneOrder(requestParams, context, ee, next){
	console.log('start get for get order');
	let orderNo = orderArr[getRandom(orderArr.length)].toString();
	requestParams.url = `/Orders/${orderNo}`;
	// console.log(requestParams)
	return next();
}

function getOrderList(requestParams, context, ee, next) {
	console.log('start post for get order list');
	requestParams.body = {"sort": -1};
	requestParams.json = true;
	// console.log(requestParams)
	return next();
}

function createOrder(requestParams, context, ee, next) {
	console.log('start post for create new order');
	let body = createOrderParamsArr[getRandom(createOrderParamsArr.length)];
	requestParams.body = body;
	requestParams.json = true;
	// console.log(requestParams)
	return next();
}

function testCreateUnified(requestParams, context, ee, next){
	console.log('start post for test unified order');
	let body = testOrderParamsArr[getRandom(testOrderParamsArr.length)];
	let token = tokenArr[getRandom(tokenArr.length)];
	requestParams.body = body;
	requestParams.body.access_token = token;
	requestParams.json = true;
	// console.log(requestParams)
	return next();
}


function logResBody(requestParams, response, context, ee, next) {
	console.log(response.body);
 	// if(response.body.code != 2000 && (typeof response == 'string' && JSON.parse(response.body).code != 2000)) console.log(response.body);
 	// else console.log('success  ', successOrder++);
 	if(response.body.code == 2000) console.log('success  ', ++successOrder);
    return next(); // MUST be called for the scenario to continue
}

function getRandom(len) {
	return Math.floor(Math.random()*len);
}

module.exports = {
	getOneOrder: getOneOrder,
	getOrderList: getOrderList,
	createOrder: createOrder,
	testCreateUnified: testCreateUnified,
	logResBody: logResBody,
}
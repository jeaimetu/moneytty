var express = require('express');
var bodyParser     =        require("body-parser");
var app = express();
var path = require('path');

const contract = require("./contract");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
	console.log("authentication check");
	if(req.headers.apikey == process.env.magic){
		console.log("auth success");
		return next();
	}else{
  		console.log("auth fail");
  		return res.status(500).send('Magic code is different')
	}
})


app.post("/v1/users/check2", function(req, res) {
	console.log("/v1/users/check2", req.body.euser, req.body.iuser, req.body.memo);
	///calling smart contract
	contract.linkAccount (req.body.euser, req.body.iuser, req.body.memo, (result) => {
		res.send(result);
	});	
});

app.post("/v1/users/delaccount", function(req, res) {
	console.log("/v1/users/delaccount", req.body.euser);
	///calling smart contract
	contract.delAccount(req.body.euser, (result) => {
		res.send(result);
	});	
});


app.post("/v1/users/get-link-status", function(req, res) { 

	  var iuser = req.body.iuser;

	  console.log("get-link-status event", iuser);
	  ///calling smart contract
	  contract.linkStatus (iuser, (result) => {
		res.send(result);
	});
	
});


app.post("/v1/users/give", function(req, res) { 
	const from = req.body.from;
	const to = req.body.to;
	const quantity = req.body.quantity;
	const event_case = req.body.event_case;
	const ttconid = req.body.ttconid;
	
	console.log("/v1/users/give", from, to, quantity, event_case, ttconid);
	contract.give(from, to, quantity, event_case, ttconid, (result) => {
		res.send(result);
	});
	  
});

app.post("/v1/users/newaccount", function(req, res) {
	console.log("/v1/users/newaccount", req.body.username);
	contract.newAccount(req.body.username, (result) => {
		res.send(result);
	});
});

app.post("/v1/users/refund", function(req, res) {
	console.log("/v1/users/refund", req.body.from, req.body.user);
	contract.refund(req.body.from, req.body.user,  (result) => {
		res.send(result);
	});
});

app.post("/v1/users/updatetp", function(req, res) {
	console.log("/v1/users/updatetp", req.body.username, req.body.quantity);
	contract.updatetp(req.body.username, req.body.quantity,  (result) => {
		res.send(result);
	});
});

app.post("/v1/users/tooktransfer", function(req, res) { 
	  var to = req.body.to;
	  var quantity = req.body.quantity;
	  var memo = req.body.memo;
	  console.log("/v1/users/tooktransfer", to, quantity, memo);
	  //save this data to mongoDB//
	  contract.tooktransfer (to, quantity, memo, (result) => {
		res.send(result);
	  });
});

app.post("/v1/users/stake", function(req, res) { 

	  var from = req.body.from;
	  var to = req.body.to;
	  var quantity = req.body.quantity;
	  console.log("/v1/users/stake", from, to, quantity);
	
	  contract.stake(from, to, quantity, (result) => {
		res.send(result);
	  });
});

app.post("/v1/users/unstake", function(req, res) { 

	  var from = req.body.from;
	  var to = req.body.to;
	  var quantity = req.body.quantity;
	  console.log("/v1/users/unstake", from, to, quantity);
	
	  contract.unStake(from, to, quantity, (result) => {
		res.send(result);
	  });
});



app.post("/v1/users/assets", function(req, res) { 

	  console.log(req.headers.apikey);
	  var iuser = req.body.iuser;
	  var euser = req.body.euser;
	  console.log("/v1/users/assets", iuser, euser);
	  //save this data to mongoDB//
	  contract.getAsset(iuser, euser, (result) => {
		   res.send(result);
	  });
});




 /* serves all the static files */
 app.get(/^(.+)$/, function(req, res){ 
     console.log('static file request : ' + req.params);
	 console.log("app get", req.params[0]);
	 console.log("app get parameter", req.query.name);
     res.sendfile( __dirname + req.params[0]); 
 });

var port = process.env.PORT || 5000;
console.log("port", port);

app.listen(port, function() {
	console.log("Listening on " + port);
});

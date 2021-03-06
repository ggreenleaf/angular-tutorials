var User = require('./models/user');
var moment = require('moment');
var jwt = require('jwt-simple');
var config = require('./config');


/*
-------------------------------
Loging required middleware
-------------------------------
*/
function isLoggedIn (req, res, next) {
	if (!req.headers.authorization) {
		return res.status(401).send({message: 'Please make sure your request has an Authorization header' });
	}

	var token = req.headers.authorization.split(' ')[1];
	var payload = jwt.decode(token, config.TOKEN_SECRET);

	if (payload.exp <= Date.now()) {
		return res.status(401).send({message: 'Token has expired'});
	}
	req.user = payload.sub;
	next();
}

/*
---------------------------
Generate JSON Web Token
------------------------------
*/
function createToken (req, user) {
	var payload = {
		iss: req.hostname,
		sub: user._id,
		iat: moment().valueOf(),
		exp: moment().add(14, 'days').valueOf()
	}
	return jwt.encode(payload,config.TOKEN_SECRET);
}

/*
----------------------------------
App Routes 
-----------------------------------
*/
module.exports = function (app) {
/*
--------------------------------------------------------------------------
GET /api/me 
--------------------------------------------------------------------------
*/
app.get('/api/me', isLoggedIn, function (req, res) {
	User.findById(req.user, function (err, user) {
		res.send(user);
	});
});
/*
--------------------------------------------------------------------------
PUT /api/me
--------------------------------------------------------------------------
*/
app.put('/api/me', isLoggedIn, function (req, res) {
	User.findById(req.user, function (err, user) {
		if (!user) {
			return res.status(400).send({message: 'User not found' });
		}
		user.displayName = req.body.displayaName || user.displayName;
		user.email = req.body.email || user.email;
		user.save(function (err) {
			res.status(200).end();
		});
	});
});
/*
--------------------------------------------------------------------------
Logging in with email
--------------------------------------------------------------------------
*/
app.post('/auth/login', function (req, res) {
	User.findOne({email: req.body.email}, '+password', function(err, user) {
		if (!user) {
			return res.status(401).send({message: 'Wrong email and/or password'});			
		}

		user.comparePassword(req.body.password, function(err, isMatch) {
			if (!isMatch) {
				return res.status(401).send({message: 'Wrong email and/or password'});
			}
			res.send({token: createToken(req, user) });
		});
	});
});
/*
--------------------------------------------------------------------------
Create email and password Account
--------------------------------------------------------------------------
*/
app.post('/auth/signup', function (req, res) {
	var user = new User();
	user.displayName = req.body.displayName;
	user.email = req.body.email;
	user.password = req.body.password;
	user.save(function (err) {
		res.send({token: createToken(req, user) });
	});
});
/*
--------------------------------------------------------------------------
Get all todos for current user
--------------------------------------------------------------------------
*/
app.get('/api/todos', isLoggedIn, function (req, res) {
	User.findById(req.user, function (err, user) {
		if (err)
			res.send(err);
		res.json(user.todos);
	});
});
/*
--------------------------------------------------------------------------
create a todo and send back all todos after creation
--------------------------------------------------------------------------
*/
app.post('/api/todos', isLoggedIn, function (req, res) {
	User.findByIdAndUpdate(
		req.user, 
		{$push: {"todos":{text: req.body.text, upvotes: 0}}},
		function (err, user) {
			console.log(user);
			if (err) {
				console.log(err);
				res.send(err);
			}
		res.json(user.todos);	
		});
});
/*
-------------------------------------
Delete a todo passed by its _id from user and send all remaining todos
-------------------------------------
*/
app.delete('/api/todos/:todo_id', isLoggedIn, function (req, res) {
	User.findByIdAndUpdate(
		req.user,
		{$pull: {todos: { _id: req.params.todo_id}}},
		function (err, user) {
			if (err) {
				res.send(err);
			}
		res.json(user.todos);
		});
});
/*
------------------------------------
adding importance to a todo 
------------------------------------
*/
app.put('/api/todos/upvote/:todo_id', isLoggedIn, function (req, res) {
	User.update(
		{ 'todos._id': req.params.todo_id },
		{$inc : {'todos.$.upvotes': 1 }},
		function (err, user) {
			if (err)
				res.send(err);
		});
	User.findById(req.user, function (err, user) {
		if (err)
			res.send(err);
		res.json(user.todos);
	});
});






} //end of export
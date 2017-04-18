// app/routes.js
import User       from '../api/models/user';
import fs 			from 'fs';
import uuid			from 'uuid';
import path			from 'path';

module.exports = (app, passport) => {

// 	// SIGNIN ===============================
// 	app.route('/signin')
// 	.get((req, res) => {
// 		res.render('signin.ejs', { message: req.flash('signinMessage') });
// 	})
// 	.post(passport.authenticate('local-signin', { successRedirect: '/profile',
// 	failureRedirect: '/signin',
// 	failureFlash: true })
// )
//
// // SIGNUP ==============================
// app.route('/signup')
// .get((req, res) => {
// 	res.render('signup.ejs', { message: req.flash('signupMessage') });
// })
// .post((req, res, next) => {
// 	passport.authenticate('local-signup', function(err, user, info) {
// 		//console.log(info);
// 		if (err) { return next(err); }
// 		if (!user) { return res.redirect('/signup'); }
// 		req.login(user, function(err) {
// 			if (err) { return next(err); }
// 			return res.redirect('/profile');
// 		});
// 	})(req, res, next);
// })
//
// // LOGGED SECTION =====================
// app.use(isLoggedIn)
//
// PROFILE SECTION =====================
// app.get('/myprofile', (req, res) => {
// 	res.render('profile.ejs', {
// 		user : req.user
// 	});
// })

app.get('/api/profile/:login', (req, res) => {
	User.findOne({ 'login' :  req.params.login }, (err, user) => {
		if (err) throw err;
		if (!user) return res.status(404).send("User inexistant.");
		const {login, firstname, lastname, popularity, pictures, about, tags} = user;
		const age = user.getAge();
		const data = {login, firstname, lastname, age, popularity, pictures, about, tags};
		console.log(data);
		res.send(JSON.stringify(data));
	})
})

// // GALLERY SECTION =====================
// app.get('/gallery', (req, res) => {
// 	User.findOne({ 'login' :  req.user.login }, (err, user) => {
// 		if (err) throw err;
// 		res.render('gallery.ejs', {
// 			'user': user,
// 		});
// 	})
// })
//
// PICTURES =====================
app.get('/api/pictures/:login/:id', (req, res, next) => {
	User.findOne({ 'login' :  req.params.login }, (err, user) => {
		if (err) throw err;
		res.sendFile(path.resolve(__dirname, '../images/' + req.params.login + '/' + req.params.id), function (err) {
			if (err) {
				next(err);
			} else {
				console.log('Sent:', req.params.id);
			}
		})
	})
})

// // LOGOUT ==============================
// app.get('/logout', (req, res) => {
// 	req.logout();
// 	res.redirect('/');
// })
//
// // FILE UPLOAD =====================
// app.post('/upload', (req, res) => {
// 	if (!req.files || !req.files.image)
// 	return res.status(400).send('No images were uploaded.');
//
// 	const image = req.files.image;
//
// 	User.findOne({ 'login' :  req.user.login }, (err, user) => {
// 		if (err) throw err;
// 		console.log(user.pictures);
// 		if (user.pictures.length >= 5)
// 		return res.status(400).send('Too many images.');
//
// 		const userPath = './images/' + user.login;
//
// 		fs.access(userPath, fs.F_OK, (err) => {
// 			if (err)
// 			{
// 				fs.mkdir(userPath, (err) => {
// 					if (err) throw err;
// 					console.log("userFolder created !");
// 				})
// 			}
// 		});
//
// 		const imageId = uuid.v4();
// 		user.pictures = [...user.pictures, imageId];
// 		user.save((err) => {
// 			if (err) console.log(err);
// 			console.log('User successfully updated!');
// 		})
// 		const imagePath = userPath + '/' + imageId;
// 		image.mv(imagePath, function(err) {
// 			if (err)
// 			return res.status(500).send(err);
// 			res.send('File uploaded!');
// 		});
// 	})
// })
//
// // INFO UPDATE =====================
// app.post('/update-info', (req, res) => {
//
// })
//
}

// route middleware to make sure a user is logged in
const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated())
	return next();
	res.redirect('/');
}

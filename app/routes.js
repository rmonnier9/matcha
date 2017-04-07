// app/routes.js
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // LOGIN ===============================
    app.get('/signin', function(req, res) {
        res.render('signin.ejs', { message: req.flash('signinMessage') });
    });

    app.post('/signin',
        passport.authenticate('local-signin', { successRedirect: '/profile',
                                                failureRedirect: '/signin',
                                                failureFlash: true })
    );

    // SIGNUP ==============================
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', function(req, res, next) {
	   	passport.authenticate('local-signup', function(err, user, info) {
	     		if (err) { return next(err); }
	     		if (!user) { return res.redirect('/login'); }
	     		req.login(user, function(err) {
	       		if (err) { return next(err); }
	       		return res.redirect('/profile');
	     		});
	   	})(req, res, next);
	 });

    // PROFILE SECTION =====================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // FILE UPLOAD =====================
	app.post('/upload', function(req, res) {
	  if (!req.files)
	    return res.status(400).send('No files were uploaded.');

	  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	  const image = req.files.image;

	  // Use the mv() method to place the file somewhere on your server
	  image.mv('./images/' + req.files.image.name , function(err) {
	    if (err)
	      return res.status(500).send(err);

	    res.send('File uploaded!');
	  });
	});

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

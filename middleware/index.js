const middlewareObj = {};

// Logged in middleware
middlewareObj.isLoggedIn = function(req, res, next) {
	if(!req.isAuthenticated()) {
		return res.json({error: "You must be logged in to do that!"});
	}

	return next();
};

module.exports = middlewareObj;
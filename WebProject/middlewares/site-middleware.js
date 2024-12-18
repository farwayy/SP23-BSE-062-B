let User = require("../models/user.model");

module.exports = async function (req, res, next) {
    let defaultUser = await User.findOne();
    if (!defaultUser) return res.status(404).send("Default user not found");

    req.session.user = defaultUser;
    res.locals.user = req.session.user;
    req.user = req.session.user;
    next();
};

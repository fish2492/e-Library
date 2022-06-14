const jwt = require("jsonwebtoken");
const config = require("config");
const func = require("@hapi/joi/lib/types/func");
const { use } = require("bcrypt/promises");
const { User } = require("../models/user");

module.exports = function (req, res, next) {
    if( !req.user.isAdmin ) return res.status(403).send("Access denied!");
    
    next();
}
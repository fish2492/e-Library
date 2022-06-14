const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const date = require("@hapi/joi/lib/types/date");

const returnSchema = new mongoose.Schema({
    rentalID: String,
    title: String,
    customerRetruned: String,
    bookID: String,
    customerID: String,
    dateReturned:{
        type: Date,
        default: Date.now
    },
    rentStat: Boolean
})

const Return = mongoose.model("Return", returnSchema);

function validateReturn(ret) {
    const schema = {
        bookID: Joi.string().required(),
        customerID: Joi.string().required()
    }

    return Joi.validate(ret, schema);
}

exports.Return = Return;
exports.validate = validateReturn;
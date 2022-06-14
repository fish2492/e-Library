const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const func = require("@hapi/joi/lib/types/func");
const { customerSchema } = require("./customer");

const rentalSchema = new mongoose.Schema({
    customer: {
        type: customerSchema,
        /*new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 2,
                maxlength: 15
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }),*/
        required: true
    },
    book: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                minlength: 2,
                maxlength: 50,
                trim: true
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                minlength: 1,
                maxlength: 50
            },

        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        minlength: 1,
        maxlength: 10,
        required: true
    }
});

const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(rental) {
    const schema = {
        customerID: Joi.string().required(),
        bookID: Joi.string().required(),
        rentalFee: Joi.number().required()
    }

    return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;
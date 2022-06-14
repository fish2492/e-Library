const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const { genreSchema } = require("./genre");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        //enum: ["fish", "book"]
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});

const Book = mongoose.model("Book", bookSchema);

function validateBook(book) {
    const schema = {
        title: Joi.string().min(2).max(50).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    }

    return Joi.validate(book, schema);
}

exports.Book = Book;
exports.validate = validateBook;
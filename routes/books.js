const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const _ = require("lodash");
const { Book, validate } = require("../models/book");
const { Genre } = require("../models/genre");
const router = express.Router();


router.get("/", async (req, res) => {
    const books = await Book.find().sort("title");
    if( !books ) return res.status(404).send("Books not Found!");

    res.send(book);
})

router.get("/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if ( !book ) return res.status(404).send("Book not Found!");

        res.send(book);
    }
   
    catch (ex) {
        res.send("Wrong book ID!");
    }
})

router.post("/", [auth, admin], async (req, res) => {
        const { error } = validate(req.body);
        if( error ) return res.status(404).send(error.details[0].message);

        const gen = await Genre.findById(req.body.genreId);
        if( !gen ) return res.status(400).send("Invalid GenreID!");

        let book = new Book({
            title: req.body.title,
            genre: {
                _id: gen._id,
                name: gen.name
            },    
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });
        book = await book.save();
    
        res.send(book);
})

router.put("/:id", [auth, admin], async (req, res) => {
    try {
        const { error } = validate(req.body);
        if( error ) return res.status(404).send(error.details[0].message);

        const gen = await Genre.findById(req.body.genreId);
        if( !gen ) return res.status(400).send("Invalid GenreID!");

        const book = await Book.findByIdAndUpdate(req.params.id,
        {
          title: req.body.title,
          genre: {
              _id: gen._id,
              name: gen.name
          },
          numberInStock: req.body.numberInStock,
          dailyRentalRate: req.body.dailyRentalRate
        },{new: true});

        if( !book ) return res.status(404).send("Book not Found!");

        res.send(book);
    }

    catch (ex) {
        res.send("Wrong Book ID!");
    }
    
})

router.delete("/:id", [auth, admin], async (req, res) => {
    try {
        const book = await Book.findByIdAndRemove(req.params.id);
        if( !book ) return res.status(404).send("Book not Found!");

        res.send(book);
    }

    catch (ex) {
        res.send("Wrong Book ID!");
    }
})

module.exports = router;
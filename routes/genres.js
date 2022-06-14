const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const _ = require("lodash");
const { Genre, validate } = require("../models/genre");
const router = express.Router();


router.get("/", async (req, res) => {
    const genres = await Genre.find().sort("genre");
    if( !genres ) return res.status(404).send("Genres Not Found!")

    res.send(genres);
})

router.get("/:id", async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id);
        if( !genre ) return res.status(404).send("Genre Not Found!");

        res.send(genre);
    }
    
    catch (ex) {
        res.send("Wrong Genre ID!");
    } 
})

router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if( error ) return res.status(404).send(error.details[0].message);

    genre = new Genre(_.pick(req.body, ["name"]));
    await genre.save();

    res.send(genre);
})

router.put("/:id", auth, async (req, res) => {
    try {
        const { error } = validate(req.body);
        if( error ) return res.status(404).send(error.details[0].message);
    
        const genre = await Genre.findByIdAndUpdate(req.params.id,
            {name: req.body.name},
            {new: true});
    
        if( !genre ) return res.status(404).send("Genre not Found!");

        res.send(genre);
    }

    catch (ex) {
        res.send("Wrong genre ID!");
    }
})

router.delete("/:id", [auth, admin], async (req, res) => {
    try {
        const genre = await Genre.findByIdAndRemove(req.params.id);
        if( !genre ) return res.status(404).send("Genre not Found!");

        res.send(genre);
    }

    catch (ex) {
        res.send("Wrong genre ID");
    }
})

module.exports = router;
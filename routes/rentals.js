const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Rental, validate } = require("../models/rental");
const { Return } = require("../models/return");
const { Customer } = require("../models/customer");
const { Book } = require("../models/book");
const { response } = require("express");

router.get("/", [auth, admin], async (req, res) => {
    const rentals = await Rental.find().sort("customer");
    if( !rentals ) return res.status(404).send("Rentals not Found!");

    res.send(rentals);
})

router.get("/:id", [auth, admin], async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);
        if( !rental ) return res.status(404).send("Rental not Found!");

        res.send(rental);
    }

    catch (ex) {
        res.send("Wrong Rental ID!");
    }
})

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if( error ) return res.status(404).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerID);
    if( !customer ) return res.status(404).send("Invalid CustomerID!");

    const book = await Book.findById(req.body.bookID);
    if( !book ) return res.status(404).send("Invalid BookID!");

    if( book.numberInStock == 0 ) return res.status(400).send("Book not in Stock");

    const repeated = await Rental.findOne({"customer._id": req.body.customerID, "book._id": req.body.bookID});
    if( repeated && repeated.customer.rentStat ) return res.status(404).send("Can't rent a book twice.");

    const rented = await Rental.findOne({"customer._id": req.body.customerID});
    if( rented && rented.customer.rentStat) return res.status(404).send("Already rented a book!");

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone,
            rentStat: true 
        },
        book: {
            _id: book._id,
            title: book.title,
            dailyRentalRate: book.dailyRentalRate
        },
        rentalFee: req.body.rentalFee
        
    })
    rental = await rental.save();

    book.numberInStock--;
    book.save();

    res.send(rental);
})

router.put("/:id", [auth, admin], async (req, res) => {
    try {
        const { error } = validate(req.body);
        if( error ) return res.status(404).send(error.details[0].message);
    
        const customer = await Customer.findById(req.body.customerID);
        if( !customer ) return res.status(404).send("Invalid customerID!");
    
        const book = await Book.findById(req.body.bookID);
        if( !book ) return res.status(404).send("Invalid bookID!");

        const repeated = await Rental.findOne({"customer._id": req.body.customerID, "book._id": req.body.bookID});
        if( repeated ) return res.status(404).send("Can't rent a book twice.");

        const rental = await Rental.findByIdAndUpdate(req.params.id,
            {
                customer: {
                    _id: customer._id,
                    name: customer.name,
                    isGold: customer.isGold,
                    phone: customer.phone 
                },
                book: {
                    _id: book._id,
                    title: book.title,
                    dailyRentalRate: book.dailyRentalRate
                },
                rentalFee: req.body.rentalFee
            }, {new: true})

            if( !rental ) return res.status(404).send("Rental not Found!");

            res.send(rental);
    }

    catch (ex) {
        res.send("Wrong Rental ID!");
    }
   
})


module.exports = router;
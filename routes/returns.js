const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const _ = require("lodash");
const { Return, validate } = require("../models/return");
const { Rental } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Book } = require("../models/book");
const router = express.Router();

router.post("/", async (req, res) => {
    const{ error } = validate(req.body);
    if( error ) return res.status(400).send(error.details[0].message);

    const book = await Book.findById(req.body.bookID);
    if( !book ) return res.status(400).send("Book not Found!");

    const customer = await Customer.findById(req.body.customerID);
    if( !customer ) return res.status(400).send("Customer not Found!");

    const rental = await Rental.findOne({"customer._id": req.body.customerID, "book._id": req.body.bookID});
    if( !rental ) return res.status(400).send("Rental not Found!");

    const repeated = await Return.findOne({"customerID": req.body.customerID, "bookID": req.body.bookID});
    if( repeated && repeated.rentStat ) return res.status(400).send("Request in progress, Please wait an approval.");

    let ret = new Return({
        title: book.title,
        customerReturned: customer.name,
        rentalID: rental._id,
        rentStat: true,
        customerID: req.body.customerID,
        bookID: req.body.bookID
    })

    ret = await ret.save();

    res.send(ret);
})

router.delete("/:id", [auth, admin], async (req, res) => {
    try {
        const ret = await Return.findById(req.params.id);
        if ( !ret ) return res.status(400).send("Returns not Found!");

        ret.rentStat = false;
        await ret.save();
        
        const rental = await Rental.findById(ret.rentalID);
        if( !rental ) return res.status(400).send("Rental not Found!");

        rental.customer.rentStat = false;
        await rental.save();

        res.send(ret);
    }

    catch (ex) {
        res.send("Wrong Rental ID!");
    }
})

module.exports = router;
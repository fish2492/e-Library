const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Customer, validate } = require("../models/customer");

router.get("/", [auth, admin], async (req, res) => {
    const customers = await Customer.find().sort("name");
    if( !customers )  return res.status(404).send("Cusotmers not Found!");
    
    res.send(customers);
})
router.get("/:id", [auth, admin], async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if( !customer )  return res.status(404).send("Cusotmer not Found!");
    
        res.send(customer);
    }

    catch (ex) {
        res.send("Wrong Cusotmer ID!")
    }
    
})

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if( error ) return res.status(400).send(error.details[0].message);

    customer = new Customer(_.pick(req.body, ["name", "isGold", "phone"]));
    await customer.save();

    res.send(customer);
})

router.put("/:id", [auth, admin], async (req, res) => {
    try {
        const { error } = validate(req.body);
        if( error ) return res.status(400).send(error.details[0].message);
    
        const customer = await Customer.findByIdAndUpdate(req.params.id,
            {
                name: req.body.name,
                isGold: req.body.isGold,
                phone: req.body.phone
            },{new: true});
            
        if( !customer ) return res.status(404).send("Customer not Found!");
        
        res.send(customer);
    }

    catch (ex) {
        res.send("Wrong Customer ID!")
    }
    
})

router.delete("/:id", [auth, admin], async (req, res) => {
    try {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if( !customer ) return res.status(404).send("Customer not Found!")

    res.send(customer);
    }

    catch (ex) {
        res.send("Wrong Customer ID!")
    }
})

module.exports = router;
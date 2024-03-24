const express = require('express');
const router = express.Router();
const Client = require('../models/clientModel');

router.get('/', (req, res) => {
    Client.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                clients: docs
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});

router.post('/', (req, res, next) => {
    const client = new Client({
        id: req.body.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        city: req.body.city,
        street: req.body.street,
        number: req.body.number,
        phone: req.body.phone,
        telephone: req.body.telephone,
        dob: req.body.dob,
        vaccineDates: req.body.vaccineDates,
        vaccineManufactors: req.body.vaccineManufactors,
        positiveDate: req.body.positiveDate,
        recoveryDate: req.body.recoveryDate
    });
    client
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created client successfuly",
                createdClient: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.get('/:clientId', (req, res, next) => {
    const id = req.params.clientId;
    Client.findById(id)
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: 'No valid entry fount for provided ID' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.patch('/:clientId', (req, res, next) => {
    const id = req.params.clientId;
    if (!id) {
        res.status(401).send('id is missing')
    }
    Client.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                city: req.body.city,
                street: req.body.street,
                number: req.body.number,
                phone: req.body.phone,
                telephone: req.body.telephone,
                dob: req.body.dob,
                vaccineDates: req.body.vaccineDates,
                vaccineManufactors: req.body.vaccineManufactors,
                positiveDate: req.body.positiveDate,
                recoveryDate: req.body.recoveryDate
            }
        })
        .exec()
        .then(result => {
            res.status(200).json({ message: 'Client Updated' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.delete('/:clientId', (req, res, next) => {
    const id = req.params.clientId;
    Client.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

// Routes for client operations
// router.post('/', clientController.addClient);
// router.get('/', clientController.getClients);
// router.put('/:id', clientController.updateClient);
// router.delete('/:id', clientController.deleteClient);

module.exports = router;

const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

const clientRoutes = require('./routes/clientRoutes');

mongoose.connect('mongodb+srv://admin:ayala@cluster0.4b84i4x.mongodb.net/');

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authoriuzation"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/clients', clientRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://ayalatzuriel:qGwpSpMv8jVJCRfo@clients-details.cl3sgbf.mongodb.net/?retryWrites=true&w=majority&appName=Clients-details";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);*/


module.exports = app;
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


// MongoDB 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kqnws.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        client.connect();
        const collection = client.db("water").collection("product");





    }
    finally {
        // client.close();
    }
}




// App Root 
app.get('/', (req, res) => {
    res.send('Water warehouse running');
})

// Port Listening 
app.listen(port, () => {
    console.log('listening to port : ', port)
})

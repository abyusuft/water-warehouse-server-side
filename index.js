const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
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
        const productCollection = client.db("water").collection("product");

        // Post Items
        app.post('/additem', async (req, res) => {
            const items = req.body;
            const result = await productCollection.insertOne(items);
            res.send(result);
        })

        // Get all Items 
        app.get('/items', async (req, res) => {
            const items = {};
            const cursor = productCollection.find(items);
            const result = await cursor.toArray();
            res.send(result);
        })

        //Delete Item 
        app.delete('/deleteitem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })





    }
    finally {
        // client.close();
    }
}

run().catch(console.dir);



// App Root 
app.get('/', (req, res) => {
    res.send('Water warehouse running');
})

// Port Listening 
app.listen(port, () => {
    console.log('listening to port : ', port)
})

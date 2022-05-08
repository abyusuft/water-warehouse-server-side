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
        const soldCollection = client.db("water").collection("deliver");

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
        // Get single Items 
        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const item = { _id: ObjectId(id) };
            const cursor = await productCollection.findOne(item);
            res.send(cursor);
        })
        // Get Items by Email
        app.get('/itemsbyemail', async (req, res) => {
            console.log('query', req.query)
            const email = req.query.email;
            const items = { email: (email) };
            const cursor = productCollection.find(items);
            const result = await cursor.toArray();
            res.send(result);
        })

        //Delete Item 
        app.delete('/deleteitem/:id', async (req, res) => {
            const id = req.params.id;
            const items = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(items);
            res.send(result);
        })

        //Deliver Item 
        app.put('/deliveritem/:id', async (req, res) => {
            const id = req.params.id;
            const deliverItem = req.body;
            const deliverQty = deliverItem.newQtydelivered;
            console.log(deliverQty);
            console.log(id);
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updateQty = {
                $set: {
                    qty: deliverQty
                }
            }
            const result = await productCollection.updateOne(filter, updateQty, option);
            res.send(result);
        })
        //Sold Item insert
        app.post('/solditem/:id', async (req, res) => {

            const items = req.body;
            console.log(items)
            const result = await soldCollection.insertOne(items);
            res.send(result);
        })

        // --------------------------------------------------------
        // get Sum of Sold Qty 
        app.get('/soldqty/:id', async (req, res) => {
            const id = req.params.id;
            const item = { _id: ObjectId(id) };
            const cursor = await soldCollection.aggregate([
                {
                    $group:
                        { _id: "$itemId", TotalSum: { $sum: 1 } }
                },
                {
                    $match: { _id: id }
                }

            ]
            );
            const restul = await cursor.toArray();
            console.log(restul);
            res.send(restul);
        })

        // --------------------------------------------------------


        //restock Item 
        app.put('/restockitem/:id', async (req, res) => {
            const id = req.params.id;
            const restockItem = req.body;
            const restockQty = restockItem.qtyAfterRestock;
            console.log(restockQty);
            console.log(id);
            const item = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updateQty = {
                $set: {
                    qty: restockQty
                }
            }
            const result = await productCollection.updateOne(item, updateQty, option);
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

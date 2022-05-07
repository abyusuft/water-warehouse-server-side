const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


// App Root 
app.get('/', (req, res) => {
    res.send('water Warehouse Running');
})

// Port Listening 
app.listen(port, () => {
    console.log('listening to port : ', port)
})

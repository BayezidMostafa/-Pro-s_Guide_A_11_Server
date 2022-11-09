require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tikoekt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async () => {
    try {
        const serviceCollection = client.db('guiderDB1').collection('services');
        // app.get('/services_lmt', async(req, res) => {
        //     const query = {};
        //     const cursor = serviceCollection.find(query).limit(3);
        //     const services = await cursor.toArray()
        //     res.send(services);
        // })
        app.get('/services', async (req, res) => {
            const size = Number(req.query.size);
            const query = {};
            const cursor = serviceCollection.find(query).limit(size);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = {_id: ObjectId(id)}
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })
    }
    finally { }
}
run().catch(err => console.error(err));




app.get('/', (req, res) => {
    res.send("My Pro's Guide server is running");
})

app.listen(port, () => {
    console.log(`My Pro's Guide server running on port: ${port}`);
})
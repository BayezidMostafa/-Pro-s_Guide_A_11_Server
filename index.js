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
        const reviewCollection = client.db('guiderDB1').collection('reviews');
        app.get('/services', async (req, res) => {
            const size = Number(req.query.size);
            const query = {};
            const cursor = serviceCollection.find(query).limit(size);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })
        app.get('/reviews', async (req, res) => {
            let query = {};
            console.log(req.query);
            if (req.query.serviceName) {
                query = {
                    serviceName: req.query.serviceName
                }
            }
            console.log(query);
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray()
            res.send(review)
        })
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })
        app.get('/myReviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query)
            const output = await cursor.toArray()
            res.send(output)
        })
        app.delete('/myReviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
        app.patch('/myReviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const review = req.body;
            updateReview = {
                $set: {
                    review_comment: review.review_comment,
                    rating: review.rating
                }
            }
            const result = await reviewCollection.updateOne(query, updateReview);
            res.send(result);
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
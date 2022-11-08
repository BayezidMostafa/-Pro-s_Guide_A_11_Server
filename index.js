require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send("My Pro's Guide server is running");
})

app.listen(port, () => {
    console.log(`My Pro's Guide server running on port: ${port}`);
})
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config()

const app = express();

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

const authRoutes = require('./routes/user');
const complaintRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/tickets', complaintRoutes);


app.get("/", async (req, res) => {
    res.status(200).json("Server is up and running")
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    mongoose
        .connect(process.env.MONGODB_URL)
        .then(() => console.log("Database connected successfully"))
        .catch(error => console.error(error))
});




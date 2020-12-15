const express = require('express');
const dotenv = require('dotenv')
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

//Import Routes
const authRoute = require('./routes/auth')
const postRouter = require('./routes/posts')

//Env object is available everywhere in the app
dotenv.config();

//Connect to Database 
mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser: true, useUnifiedTopology: true },() => console.log("connected to DB"))

//Middleware
app.use(express.json())

//Route middlewares
app.use('/api/user', authRoute)
app.use('/api/posts', postRouter)

//Launch server on port
app.listen(PORT, (req, res) => console.log(`server is running on http://localhost:${PORT}`))
const express = require('express');
const mongoose = require('mongoose');
const app = express()
//Routes
const userRouter = require('./routes/api/transferMoney/users/users')

//DB CONNECTION
mongoose.connect('mongodb://localhost/CTI-Ghana', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log("DB Connected successfully"));

//MIDDLEWARE
app.use(express.json({ extended: false }));


//ROUTES
app.use('/api', userRouter)


//SERVER


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
 console.log(`The Server is running on PORT ${PORT}`)
})


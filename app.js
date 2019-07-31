const express = require('express');
const mongoose = require('mongoose');
const app = express()


//DB CONNECTION
mongoose.connect('mongodb://localhost/CTI-Ghana', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log("DB Connected successfully"));





//SERVER
app.get('/', (req, res) => {
 res.json({project: 'Develped by Emma'})
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
 console.log(`The Server is running on PORT ${PORT}`)
})


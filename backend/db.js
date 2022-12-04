const mongoose = require('mongoose');
const URI = "mongodb+srv://talha:talha123@cluster0.vhg1c.mongodb.net/inotebook"

const connectmongo = ()=>{
    mongoose.connect(URI, ()=>{
        console.log('Connected to mongoDB');
    });
}

module.exports = connectmongo;
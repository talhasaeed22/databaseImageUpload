const DBconnect = require('./db')
const express = require('express')
const app = express()
const port = 5000;
var cors = require('cors');

DBconnect();

app.use(express.json())
app.use(cors())
app.use('/api/auth', require('./routes/Auth'));

app.get('/', (req, res)=>{
  res.send("Welcome to iNotebook API");
})

app.listen(port, () => {
  console.log(`inotebook is listening on port ${port}`)
})
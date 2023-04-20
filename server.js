const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url);
// const dbName = 'sensordata';
// const collectionName = 'dht22';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))

app.set('view engine', 'pug')
app.set('views', 'view')

app.get('/hienthi', (req, res) => {
  res.render('index1.pug', {/*title: req.query.title*/})
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return (
    [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('-') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
}

app.get('/data', function(req, res){
  res.send(req.query)
  console.log(req.query)
  async function run() {
    try {
      const database = client.db("sensordata");
      const dht22 = database.collection("dht22");
      // create a document to insert
      const datadht = {
        nhietdo: req.query.temp,
        doam: req.query.hum,
        date: formatDate(new Date()),
      }
      const result = await dht22.insertOne(datadht);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
      // await client.close();
    }
  }
  run().catch(console.dir);
})

app.get("/service", async (req, res) => {
  const database = client.db("sensordata");
  const dht22 = database.collection("dht22");
  const result = await dht22.find().toArray();
  res.send(result[0].doam);
})

app.get('/lastdata', async function (req, res) {
  try {
    let result = await getData()
    res.send(result[0])
  } catch (error) {
    res.send({error: true, message: 'error'})
  }
})

async function getData() {
  const database = client.db("sensordata");
  const dht22 = database.collection("dht22");
  const result = await dht22.find({}).sort({_id: -1}).limit(1).toArray()
  return result;
}


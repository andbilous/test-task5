const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { ObjectID } = require('mongodb')
const { MongoClient } = require('mongodb')
const { initDatabase, addValuesToDatabase, initialData } = require('./db.js')
const dbname = 'flightsdb'
const collectionName = 'flights'
initDatabase()

const app = express()
const port = process.env.PORT || 5000
const mongoClient = new MongoClient('mongodb://localhost:27017/', {
  useUnifiedTopology: true,
})
mongoClient.connect((err, client) => {
  if (err) return console.log(err)
  app.locals.db = client.db(dbname)
  app.locals.collection = client.db(dbname).collection(collectionName)
  app.listen(port, () => console.log(`Listening on port ${port}`))
})
addValuesToDatabase(initialData)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  cors({
    allowedHeaders: ['sessionId', 'Content-Type'],
    exposedHeaders: ['sessionId'],
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  }),
)

app.get('/api/flights', function (req, res) {
  const { collection } = req.app.locals
  collection.find({}).toArray((err, flights) => {
    if (err) return console.log(err)
    res.send(flights)
  })
})

app.put('/api/flights/:flight_id', (req, res) => {
  const { collection } = req.app.locals
  if (!req.body) return res.send(400)
  collection
    .updateOne(
      { _id: ObjectID(req.params.flight_id) },
      { $set: { status: req.body.status } },
    )
    .then(() => res.send('updated'))
    .catch((err) => console.log(`Error: ${err}`))
})

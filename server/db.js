const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017/'
const mongoClient = new MongoClient(url, { useUnifiedTopology: true })

const availableStatus = ['LANDED', 'ON SCHEDULE', 'DELAYED']

const initialData = [
  {
    id: '24',
    flightCode: 'AT246',
    flightProvider: 'AIR CANADA',
    sourcePortName: 'TORONTO',
    sourcePortCode: 'TOR',
    destinationPortName: 'KIEV',
    destinationPortCode: 'KBP',
    scheduledArrival: '17-55',
    scheduledDeparture: '19-55',
    status: availableStatus[0],
  },
  {
    id: '26',
    flightCode: 'AT242',
    flightProvider: 'AIR FRANCE',
    sourcePortName: 'PARIS',
    sourcePortCode: 'PAR',
    destinationPortName: 'LONDON',
    destinationPortCode: 'LGA',
    scheduledArrival: '05-55',
    scheduledDeparture: '07-20',
    status: availableStatus[1],
  },
]

function initDatabase() {
  mongoClient.connect(function (err, client) {
    if (err) {
      console.log(err)
    }
    client.close()
  })
}

function addValuesToDatabase(values) {
  const mongoClient = new MongoClient(url, { useUnifiedTopology: true })
  mongoClient.connect(function (err, client) {
    const db = client.db('flightsdb')
    const collection = db.collection('flights')
    collection.insertMany(values, function () {
      client.close()
    })
  })
}

module.exports = {
  initDatabase,
  addValuesToDatabase,
  initialData,
  availableStatus,
}

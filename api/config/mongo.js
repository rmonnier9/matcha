import {MongoClient}			from 'mongodb'
import assert							from 'assert'
import config       			from './config.js'


const mongoConnect = (callback) => {
	const url = config.database
	MongoClient.connect(url, (err, db) => {
		assert.equal(null, err)
		callback(db)
		console.log("Connected successfully to server")
	})
}

export default mongoConnect

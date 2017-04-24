import {MongoClient}			from 'mongodb'
import assert							from 'assert'
import config       			from './config.js'


class MongoConnection {
	static connect() {
			MongoClient.connect(config.database, (err, db) => {
					assert.equal(null, err)
					MongoConnection.db = db;
					console.log("Connected to Mongo database.");
			})
	}
}

export default MongoConnection

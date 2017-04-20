import {MongoClient}			from 'mongodb'
import assert			from 'assert'
import config        from './config/config.js'


const mongoConnect = (callback) => {
	MongoClient.connect(config.database, (err, db) => {
		assert.equal(null, err);
		return callback(db)
		db.close();
	});
}

const mongoConnectAsync = (res, callback) => {
	const mongo = mongodb.MongoClient;
	const url = 'mongodb://138.68.142.55/matcha';
	if (!res) return (mongoConnectSocket(url, mongo, callback));
	mongo.connect(url, (err, db) => {
		if (err) res.status(500).send('Error - Fail to connect to database');
		else callback(db);
	});
	return (true);
};

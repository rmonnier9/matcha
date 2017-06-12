import { MongoClient } from 'mongodb';
import assert from 'assert';
import config from './config.js';


class MongoConnection {
  constructor() {
    this.connect();
  }
  connect() {
    MongoClient.connect(config.database, (err, db) => {
      assert.equal(null, err);
      this.db = db;
      console.log('Connected to Mongo database.');
    });
  }
}

export default new MongoConnection();

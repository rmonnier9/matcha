import { MongoClient } from 'mongodb';
import config from './config';


const MongoConnection = {
  connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(config.database, (err, db) => {
        if (err) {
          reject(err);
        }
        this.db = db;
        resolve();
      });
    });
  },
};

export default MongoConnection;

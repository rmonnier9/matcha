import { MongoClient } from 'mongodb';

const MongoConnection = {
  connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(process.env.MONGODB_URI, (err, db) => {
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

const MongoConnection = require('../MongoConnection');

const getMessages = async (req, res) => {
  const { currentUser } = req.decoded;
  const { target } = req.params;

  // get user from DB
  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({
    login: target, blocked: { $ne: currentUser }, matches: currentUser });
  if (!user) return res.send({ error: 'Profile not found or no match.' });

  const chatCollection = MongoConnection.db.collection('chat');
  const cursor = chatCollection.find(
    { $or: [
      { from: target, target: currentUser },
      { from: currentUser, target },
    ],
    });
  const messages = await cursor.toArray();

  return res.json({ error: '', messages }).end();
};

module.exports = { getMessages };

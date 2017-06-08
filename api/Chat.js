import MongoConnection from './config/MongoConnection.js';

const getMessages = async (req, res) => {
  const { currentUser } = req.decoded;
  const { target } = req.params;

  // get user from DB
  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({
    login: target, blocked: { $ne: currentUser }, matches: currentUser });
  if (!user) return res.status(404).json({ error: 'Profile not found or no match.' }).end();

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

export { getMessages };

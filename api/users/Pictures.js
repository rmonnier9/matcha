import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import MongoConnection from '../config/MongoConnection';

// browser expect a content type img, res.json is then useless
const get = async (req, res, next) => {
  const { currentUser } = req.decoded;
  const { login, id } = req.params;
  const defaultPath = path.resolve(__dirname, '../uploads/no-picture.png');

  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login, blocked: { $ne: currentUser } });
  if (!user || id === 'default') return res.sendFile(defaultPath, (err) => { if (err) next(err); });

  const pictureExists = user.pictures.indexOf(id);
  const imgPath = path.resolve(__dirname, `../uploads/resized/${id}`);
  fs.access(imgPath, fs.F_OK, (err) => {
    if (err || pictureExists === -1) res.sendFile(defaultPath, (err) => { if (err) next(err); });
    else res.sendFile(imgPath, (error) => { if (error) next(error); });
  });
};

const setAsProfile = async (req, res) => {
  const { currentUser } = req.decoded;
  const { id } = req.params;

  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login: currentUser });

  const pictureIndex = user.pictures.indexOf(id);
  if (pictureIndex === -1) return res.json({ error: 'Picture not found on your profile.' });

  const update = { profilePicture: pictureIndex };
  usersCollection.updateOne({ login: currentUser }, { $set: update });
  return res.send({ error: '', profilePicture: pictureIndex });
};

const remove = async (req, res) => {
  const { currentUser } = req.decoded;
  const { id } = req.params;

  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login: currentUser });

  const pictureExists = user.pictures.indexOf(id);
  if (pictureExists === -1) return res.send({ error: 'Picture not found on your profile.' });

  const imgPath = path.resolve(__dirname, `../uploads/resized/${id}`);
  fs.unlink(imgPath, (err) => {
    if (err) {
      console.log(err);
      // return res.json({ error: 'Picture not found on server.' });
    }
    const pictures = user.pictures.filter(picture => picture !== id);

    let profilePicture = pictures.indexOf(id);
    if (profilePicture === -1) { profilePicture = pictures.length === 0 ? -1 : 0; }

    const update = { pictures, profilePicture };
    usersCollection.updateOne({ login: currentUser }, { $set: update });
    return res.send({ error: '' });
  });
};

const saveCheck = async (req, res, next) => {
  const { currentUser } = req.decoded;

  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login: currentUser });
  if (user.pictures.length >= 5) {
    return res.send({ error: 'You can\'t upload more than 5 images.' });
  }
  req.user = user;
  return next();
};

const save = async (req, res) => {
  const { user } = req;
  const { currentUser } = req.decoded;
  const { filename } = req.file;

 // check if a file has been uploaded
  if (!req.file) {
    return res.send({ error: 'No images were uploaded.' });
  }

  const oldPath = path.resolve(__dirname, `../uploads/${filename}`);
  const newPath = path.resolve(__dirname, `../uploads/resized/${filename}`);

  // async but we don't need to wait
  await sharp(oldPath)
          .resize(240, 240, {
            kernel: sharp.kernel.lanczos2,
            interpolator: sharp.interpolator.nohalo,
          })
          .toFile(newPath);

 // save filename in db
  const pictures = [...user.pictures, filename];
  const update = { pictures };
  const usersCollection = MongoConnection.db.collection('users');
  usersCollection.updateOne({ login: currentUser }, { $set: update });
  return res.send({ error: '', pictures });
};


export { save, saveCheck, get, remove, setAsProfile };

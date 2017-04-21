import mongoConnect  from './config/mongo.js'
import config        from './config/config.js'
import fs 			from 'fs'
import uuid			from 'uuid'
import path			from 'path'

const getAge = (birthDate) => {
	if (!birthDate) return null
	const ageDifMs = Date.now() - birthDate.getTime()
	const ageDate = new Date(ageDifMs)
	return Math.abs(ageDate.getUTCFullYear() - 1970)
}

const createFolder = (userPath) => {
  return new Promise((resolve, reject) => {
    fs.access(userPath, fs.F_OK, (err) => {
      if (!err) resolve()
      if (err)
      {
        fs.mkdir(userPath, (err) => {
          if (!err) resolve()
          if (err) throw err
        })
      }
    })
  })
}

const getInfo = (req, res) => {
  const	{login} = req.params
	mongoConnect( db => {
		db.collection('users').findOne({ login:  login }, (err, user) => {
			if (err) throw err;
			if (!user) return res.status(404).json({success: false, message: 'Profile not found.'})
			const {login, firstname, lastname, about, tags, pictures, profilePictureId, popularity, localisation, birthDate} = user;
			const age = getAge(birthDate);
			const data = {login, firstname, lastname, age, about, tags, pictures, profilePictureId, popularity, localisation};
			res.json({success: true, message: 'Profile found.', data: data});
      db.close()
		})
	})
  console.log(req.cookies);
}

const updateInfo = (req, res, next) => {
  const {currentUser} = req.decoded
  const	{login} =req.params
  if (login != currentUser) return res.json({success: false, message: 'No rights for update this profile.'})

  const request = req.body
  const whitelist = ['firstname', 'lastname', 'email', 'birthDate', 'gender', 'interestedIn', 'about',
                      'tags', 'profilePictureId', 'localisation']
  const update = {};

  for (let ix in whitelist)
  {
    const field = whitelist[ix];
    if (request.hasOwnProperty(field)) update[field] = request[field]
  }
  console.log(update);

  mongoConnect( db => {
		db.collection('users').updateOne({ login: login }, {$set: update}, (err, r) => {
      if (err) throw err
      // console.log('The raw response from Mongo was ', raw)
      res.json({success: true, message: 'Profile successfully updated.'})
      db.close()
		})
	})
}

const getPicture = (req, res, next) => {
  const	{login, id} = req.params
  mongoConnect( db => {
    db.collection('users').findOne({ login:  login }, (err, user) => {
      if (err) throw err;
      res.sendFile(path.resolve(__dirname, './images/' + login + '/' + id), (err) => {
        if (err) {
          next(err)
        } else {
          console.log('Sent:', id)
        }
      })
    })
  })
}

const postPicture = (req, res, next) => {
	if (!req.files || !req.files.image)
	 return res.status(400).json({success: false, message: 'No images were uploaded.'})

	const {image} = req.files
	const {currentUser} = req.decoded
	const	{login} = req.params
	if (login != currentUser) return res.json({success: false, message: 'No rights for update this profile.'})

  mongoConnect( db => {
    const col = db.collection('users')
    col.findOne({login: login }, (err, user) => {
  		if (err) throw err
  		if (user.pictures.length >= 5)
  			return res.status(400).json({success: false, message: 'Too many images.'})

  		const userPath = './images/' + login

  		createFolder(userPath).then( () => {
        const imageId = uuid.v4()
        const pictures = [...user.pictures, imageId]
        col.updateOne({login: login }, {pictures: pictures}, (err, r) => {
          if (err) throw err

          const imagePath = userPath + '/' + imageId
          image.mv(imagePath, (err) => {
            if (err)
            return res.status(500).json({success: false, message: err})
            res.json({success: true, message: 'File uploaded!'})
          })
        })
    	})
    })
  })
}


export {getInfo, updateInfo, getPicture, postPicture}

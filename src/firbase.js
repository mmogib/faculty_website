const admin = require('firebase-admin')

var serviceAccount = require('../config/serviceAdmin-dev.json')

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://facutly-website-dev.firebaseio.com',
	storageBucket: 'facutly-website-dev.appspot.com'
})
const db = admin.database()
const mainBucket = admin.storage().bucket()
const dbref = db.ref('site_requests')
const userref = db.ref('users')

module.exports = { db, mainBucket, dbref, userref }

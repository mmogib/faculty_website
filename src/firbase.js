const { exec } = require('child_process')
const admin = require('firebase-admin')
const path = require('path')

var serviceAccount = require('../config/serviceAdmin-dev.json')
const { zipit } = require('./zip')
const { remove_directory } = require('./utils')

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://facutly-website-dev.firebaseio.com',
	storageBucket: 'facutly-website-dev.appspot.com'
})
const db = admin.database()
const bucket = admin.storage().bucket()
const dbref = db.ref('site_requests')
const options = {
	// The path to which the file should be downloaded, e.g. "./file.txt"
	destination: __dirname + '/../_data/info.yml'
}
const update_processed = username => {
	dbref
		.child(username)
		.child('processed')
		.set(true)
}

const setup_link = username => {
	bucket.file(`${username}.zip`).getSignedUrl(
		{
			action: 'read',
			expires: '03-17-2035'
		},
		(error, url) => {
			if (!error) {
				dbref
					.child(username)
					.child('url')
					.set(url)
			}
		}
	)
}
const observe_db = () => {
	dbref.orderByKey().on('value', snapshot => {
		snapshot.forEach(snap => {
			const username = snap.key
			const prcessed = !!snap.child('processed').val()
			if (!prcessed) {
				const yamlfile = `${username}.yml`
				if (bucket.file(yamlfile).exists()) {
					download_yaml(yamlfile)
						.then(msg => {
							console.log(msg)
							zipit(username).then(() => {
								upload_zip(username).then(() => {
                                    update_processed(username)
									setup_link(username)
								})
							})
						})
						.catch(err => console.log(err))
				}
				console.log('value', username, snap.child('processed').val())
			}
			//snap.forEach(s=>console.log(s.val()))
		})
	})

	return
}

const upload_zip = username => {
	return new Promise((resolve, reject) => {
		bucket
			.upload(path.join(__dirname, `../archives/${username}.zip`))
			.then(result => resolve())
			.catch(error => reject(error))
	})
}

const download_yaml = yamlfile => {
	return new Promise((resolve, reject) => {
		bucket
			.file(yamlfile)
			.download(options)
			.then(file => {
				remove_directory().then(() => {
					exec(
						'jekyll b --confi=config/_config_mathsite.yml  JEKYLL_ENV=production',
						(error, stdout, stderr) => {
							if (error) {
								console.error(`exec error: ${error}`)
								reject(error)
							} else {
								resolve(`${yamlfile}: downloaded ...`)
								//console.log(`stdout: ${stdout}`)
								console.log(`stderr: ${stderr}`)
							}
						}
					)
				})
			})
			.catch(error => {
				const msg = `${yamlfile}: ${error.message}`
				reject(msg)
			})
	})
}

module.exports = { db, bucket, observe_db }

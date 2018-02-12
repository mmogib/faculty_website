const { exec } = require('child_process')
const admin = require('firebase-admin')
const path = require('path')
const fs = require('fs')

var serviceAccount = require('../config/serviceAdmin-dev.json')
const { zipit } = require('./zip')
const { remove_directory, remove_yaml } = require('./utils')

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://facutly-website-dev.firebaseio.com',
	storageBucket: 'facutly-website-dev.appspot.com'
})
const db = admin.database()
const mainBucket = admin.storage().bucket()
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
	mainBucket.file(`${username}.zip`).getSignedUrl(
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
function observe_db() {
	dbref.orderByKey().on('value', snapshot => {
		snapshot.forEach(snap => {
			const username = snap.key
			const prcessed = !!snapshot.child(`${username}/processed`).val()
			const file = snap.child('image').val()
			if (!prcessed) {
				const yamlfile = `${username}/${username}.yml`
				console.log('here', yamlfile)
				download_img(username, file).then(() => {
					mainBucket
						.file(yamlfile)
						.exists()
						.then(() => {
							remove_yaml().then(() => {
								console.log(username)
								download_yaml(yamlfile, username)
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
							})
						})
				})
			}
		})

		return
	})
}

const upload_zip = username => {
	return new Promise((resolve, reject) => {
		mainBucket
			.upload(path.join(__dirname, `../archives/${username}.zip`))
			.then(result => resolve())
			.catch(error => reject(error))
	})
}

const download_yaml = (yamlfile, username) => {
	let str = new Date().toISOString().replace(/:/g, '_')
	str = str.replace('.', '_', 'g')
	const fileDist = __dirname + `/../_data/info_${username}_${str}.yml`
	const fileToSave = __dirname + `/../_data/info.yml`
	return new Promise((resolve, reject) => {
		mainBucket
			.file(yamlfile)
			.download({
				// The path to which the file should be downloaded, e.g. "./file.txt"
				destination: fileDist
			})
			.then(file => {
				fs.copyFileSync(fileDist, fileToSave)
				remove_directory().then(() => {
					exec(
						`jekyll b --confi=config/_config_mathsite.yml  JEKYLL_ENV=production --baseurl /math/${username}/testing`,
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

function download_img(username, file) {
	return new Promise(res => res())
	/*return new Promise(resolve => {
		mainBucket
			.file(`${username}/${file}`)
			.download({
				destination: path.join(__dirname, `/../assets/images/${file}`)
			})
			.then(() => resolve())
			.catch((e) => {
				console.log(e.message)
				resolve()})
	})*/
}

module.exports = { db, mainBucket, observe_db }

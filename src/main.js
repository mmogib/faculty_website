const { dbref, mainBucket } = require('./firbase')
const { zipit, remove_yaml } = require('./utils')
const {
	download_img,
	download_yaml,
	setup_link,
	update_processed,
	last_update_teaching
} = require('./download')

const { upload_zip, uploadDataToFirebase } = require('./upload')

const options = {
	// The path to which the file should be downloaded, e.g. "./file.txt"
	destination: __dirname + '/../_data/info.yml'
}

function observe_teaching() {
	dbref.orderByKey().on('value', snapshot => {
		snapshot.forEach(snap => {
			let shouldUpdate = false
			const username = snap.key
			const lastUpdate = snapshot.child(`${username}/teaching_updated`).val()
			const now = new Date()
			if (!lastUpdate) {
				shouldUpdate = true
			} else {
				const upadted = new Date(lastUpdate)
				const timeElapsed =
					parseInt(now.getTime() - upadted.getTime()) / (60 * 1000 * 60 * 24)
				if (timeElapsed > 7) {
					shouldUpdate = true
				}
			}
			if (shouldUpdate) {
				console.log('starting uploading data for ', username, 'at ', now)
				uploadDataToFirebase(username)
				last_update_teaching(username)
			}
		})
	})
}

function observe_db() {
	dbref.orderByKey().on('value', snapshot => {
		snapshot.forEach(snap => {
			const username = snap.key
			const prcessed = !!snapshot.child(`${username}/processed`).val()
			const file = snap.child('image').val()
			if (!prcessed) {
				const yamlfile = `${username}/${username}.yml`
				console.log('creating website of ', username)
				console.log('starting uploading data for ', username)
				uploadDataToFirebase(username)
				console.log('downloading image if any ')
				download_img(username, file).then(() => {
					mainBucket
						.file(yamlfile)
						.exists()
						.then(() => {
							console.log('removing info.yml')
							remove_yaml().then(() => {
								console.log('downloading ', yamlfile)
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

module.exports = { observe_db, observe_teaching }

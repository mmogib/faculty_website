const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')

const { dbref, mainBucket } = require('./firbase')
const { remove_directory } = require('./utils')


const last_update_teaching = username =>{
	dbref.child(`${username}/teaching_updated`).set(new Date().toISOString())
}


const update_processed = username => {
	dbref
		.child(username)
		.child('processed')
        .set(true)
        .then(()=>last_update_teaching(username))
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


module.exports ={ 
    download_img,
    download_yaml,
    setup_link,
    update_processed,
    last_update_teaching
}
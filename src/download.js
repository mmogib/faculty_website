const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')

const { dbref, mainBucket, userref } = require('./firbase')
const { remove_directory } = require('./utils')

const { getFacultyData } = require('./teaching/')

const last_update_teaching = username => {
	dbref.child(`${username}/teaching_updated`).set(new Date().toISOString())
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

const prepare_yaml_content = (username, scopus_id, name, theme) => {
	let temp = []
	temp.push(`username: ${username}`)
	temp.push(`scopus_id: ${scopus_id}`)
	temp.push(`name: ${name}`)
	temp.push(`theme: ${theme}`)
	return new Promise((resolve, reject) => {
		getFacultyData(username)
			.then(factData => {
				const research_interests =
					factData[0]['research_interests'][0]['researchInterest']
				const Interestskeys = Object.keys(research_interests)
				let research_interestsArr = []
				Interestskeys.forEach((key, value) => {
					research_interestsArr.push(`- ${research_interests[key]['_']}`)
				})
				temp.push(`profile_image: ${factData[0]['image'][0]}`)
				temp.push(`position: ${factData[0]['rank'][0]}`)
				temp.push(`office: ${factData[0]['office'][0]}`)
				temp.push(`phone: +966-13-860-${factData[0]['phone'][0]}`)
				temp.push(`researchInterests: \n${research_interestsArr.join('\n')}`)
				resolve(temp.join('\n'))
			})
			.catch(error => {
				console.log(error)
				resolve(temp.join('\n'))
			})
	})
}
const create_yaml = (username, scopus_id, name, theme) => {
	let str = new Date().toISOString().replace(/:/g, '_')
	str = str.replace('.', '_', 'g')
	const fileDist = path.join(__dirname, `/../_data/info_${username}_${str}.yml`)

	const fileToSave = path.join(__dirname, `/../_data/info.yml`)

	return new Promise((resolve, reject) => {
		prepare_yaml_content(username, scopus_id, name, theme).then(data => {
			fs.open(fileDist, 'w+', (err, fd) => {
				if (err) reject(err)
				fs.appendFile(fd, data, 'utf8', err => {
					fs.close(fd, err => {
						if (err) reject(err)
					})
					if (err) reject(err)
					fs.copyFileSync(fileDist, fileToSave)
					resolve('ymal file successfully created ..')
				})
			})
		})
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
						`jekyll clean && jekyll b --confi=config/_config_mathsite.yml  JEKYLL_ENV=production --baseurl /math/${username}/testing`,
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

const create_website = username => {
	return new Promise((resolve, reject) => {
		remove_directory()
			.then(() => {
				exec(
					`jekyll clean && jekyll b --confi=config/_config_mathsite.yml JEKYLL_ENV=production --baseurl /math/${username}/testing`,
					(error, stdout, stderr) => {
						if (error) {
							console.error(`exec error: ${error}`)
							reject(error)
						} else {
							resolve(`website created ... `)
							//console.log(`stdout: ${stdout}`)
							console.log(`stderr: ${stderr}`)
						}
					}
				)
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

module.exports = {
	download_img,
	download_yaml,
	setup_link,
	update_processed,
	last_update_teaching,
	create_yaml,
	create_website
}

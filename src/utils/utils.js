// require modules
var fs = require('fs')
var path = require('path')
var rmdirectory = require('rimraf')

// create a file to stream archive data to.
const remove_directory = () => {
	return new Promise(resolve => {
		const directory = path.join(__dirname, '../../_mathfaculty')
		if (fs.existsSync(directory)) {
			rmdirectory(directory, error => {
				if (!error) {
					resolve(true)
				}
			})
		} else {
			resolve(true)
		}
	})
}

const remove_yaml = () => {
	return new Promise(resolve => {
		const yamlFile = path.join(__dirname, '../../_data/info.yml')
		if (fs.existsSync(yamlFile)) {
			rmdirectory(yamlFile, error => {
				touch_file(yamlFile)
				resolve(true)
			})
		} else {
			resolve(true)
		}
	})
}

const touch_file = file => {
	let fd

	try {
		fd = fs.openSync(file, 'a')
		//fs.appendFileSync(fd, 'data to append', 'utf8')
	} catch (err) {
		/* Handle the error */
	} finally {
		if (fd !== undefined) fs.closeSync(fd)
	}
}
module.exports = { remove_directory, remove_yaml }

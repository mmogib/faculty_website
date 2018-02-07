// require modules
var fs = require('fs')
var path = require('path')
var rmdirectory = require('rimraf')

// create a file to stream archive data to.
const remove_directory = () => {
	return new Promise(resolve => {
		const directory = path.join(__dirname, '../_mathfaculty')
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

module.exports ={remove_directory}
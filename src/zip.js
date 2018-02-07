// require modules
var fs = require('fs')
var path = require('path')
var archiver = require('archiver')

const zipit = username => {
	return new Promise((resolve, reject) => {
		var output = fs.createWriteStream(
			path.join(__dirname, `/../archives/${username}.zip`)
		)
		var archive = archiver('zip', {
			zlib: { level: 9 } // Sets the compression level.
		})

		// listen for all archive data to be written
		// 'close' event is fired only when a file descriptor is involved
		output.on('close', function() {
			console.log(archive.pointer() + ' total bytes')
			console.log(
				'archiver has been finalized and the output file descriptor has closed.'
			)
		})

		// This event is fired when the data source is drained no matter what was the data source.
		// It is not part of this library but rather from the NodeJS Stream API.
		// @see: https://nodejs.org/api/stream.html#stream_event_end
		output.on('end', function() {
			console.log('Data has been drained')
		})

		// good practice to catch warnings (ie stat failures and other non-blocking errors)
		archive.on('warning', function(err) {
			if (err.code === 'ENOENT') {
				// log warning
			} else {
				// throw error
				console.log('warning', err)
			}
		})

		// good practice to catch this error explicitly
		archive.on('error', function(err) {
			console.log('error', err)
			reject(err)
		})

		// pipe archive data to the file
		archive.pipe(output)

		// append files from a sub-directory and naming it `new-subdir` within the archive

		archive.directory(path.join(__dirname,'../_mathfaculty/'), false)

		// finalize the archive (ie we are done appending files but streams have to finish yet)
		// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
		archive
			.finalize()
			.then(() => resolve())
			.catch(err => reject(err))
	})
}

module.exports = { zipit }

const DataLoader = require('../classes/Loader')
const {URLS} = require('../config')
const xmlURL = URLS.schedule
const fields = [
	{
		name: 'course',
		attrs: ['code', 'section', 'period', 'location', 'activity', 'days']
	},
	{ name: 'officeHour', attrs: ['day'] },
	{ name: 'ohNotes' }
]

module.exports= class Schedule {
	constructor(username) {
		this.Model = new DataLoader(
			xmlURL + '?ATID=' + username,
			'facultyTeaching',
			fields
		)
	}
	getSchedule() {
		return new Promise((resolve, reject) => {
			this.Model
				.loadData()
				.then(data => {
					resolve(data)
				})
				.catch(err => {
					reject(err)
				})
		})
	}
}

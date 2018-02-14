const DataLoader =require('../classes/Loader')
const MyERRORS =require('../classes/MyErrors')
const { URLS } =require('../config/')

module.exports= class {
	constructor(queryString) {
		const url = this.prepareURL(queryString)

		const fields = [
			{
				name: 'course',
				attrs: [
					'semester',
					'code',
					'number',
					'course',
					'section',
					'instructorUserName',
					'instructorFullName',
					'links'
				]
			}
		]

		this.Loader = new DataLoader(url, 'courseFiles', fields)
		this.data = null
	}

	prepareURL(qStringObj) {
		return `${URLS.courseFiles}?${qStringObj.name}=${qStringObj.value}`
	}

	getData() {
		return new Promise((resolve, reject) => {
			this.Loader.loadData()
				.then(data => {
					this.data = data
					resolve(data)
				})
				.catch(error => {
					reject({ message: MyERRORS.DATA_NOT_AVAILABLE })
				})
		})
	}

	find(username) {
		if (this.data === null) {
			return null
		}
		return this.data.find(faculty => {
			return faculty.username.value === username
		})
	}
}

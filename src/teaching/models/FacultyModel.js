const BaseModel =require('../classes/BaseModel')
const { URLS } =require('../config/')

module.exports= class extends BaseModel {
	constructor() {
		const url = URLS.facultyList
		const fields = [
			{ name: 'username' },
			{ name: 'name' },
			{ name: 'rank' },
			{ name: 'phone' },
			{ name: 'office' },
			{ name: 'email' },
			{ name: 'image' },
			{ name: 'web' },
			{ name: 'researchInterest', attrs: ['Id'] }
		]

		super(url, 'faculty', fields)
	}

	find(username) {
		if (this.data === null) {
			return null
		}
		return this.data.facultyList.faculty.filter(faculty => {
			return faculty.username[0] === username
		})
	}
}

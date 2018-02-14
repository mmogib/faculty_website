const DataLoader =require('./Loader')
const MyERRORS =require('./MyErrors')

module.exports = class BaseModel {
	constructor(url, table, fields) {
		this.Loader = new DataLoader(url, table, fields)
		this.data = null
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
		return null
	}
}

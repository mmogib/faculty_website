import BaseModel from '../classes/BaseModel'
import { URLS } from '../config/'
export default class extends BaseModel {
	constructor() {
		const url = URLS.staffList
		const fields = [
			{ name: 'username', type: 'text' },
			{ name: 'name', type: 'text' },
			{ name: 'rank', type: 'text' },
			{ name: 'phone', type: 'text' },
			{ name: 'office', type: 'text' },
			{ name: 'email', type: 'text' },
			{ name: 'image', type: 'text' }
		]
		super(url, 'staff', fields)
	}

	getData() {
		return new Promise((resolve, reject) => {
			this.Loader.loadData()
				.then(data => {
					resolve(data)
				})
				.catch(error => {
					reject({ message: MyERRORS.DATA_NOT_AVAILABLE })
				})
		})
	}
}

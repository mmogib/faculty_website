import DataLoader from '../classes/Loader'
import MyERRORS from '../classes/MyErrors'
import MyValidator from '../classes/MyValidator'
import { URLS } from '../config/'

import xss from 'xss'

export default class {
	constructor(query = null) {
		this.queryString = query
		this.url = URLS.publicationList
		this.prepareQueryString(query)
		const fields = [
			{ name: 'code' },
			{ name: 'ref' },
			{ name: 'status' },
			{ name: 'year' },
			{ name: 'author', attrs: ['authorId'] }
		]

		this.Loader = new DataLoader(this.url, 'publication', fields)
	}

	getSaveValue(value) {
		return xss(value, {
			whiteList: [], // empty, means filter out all tags
			stripIgnoreTag: true, // filter out all HTML not in the whilelist
			stripIgnoreTagBody: ['script'] // the script tag is a special case, we need
			// to filter out its content
		})
	}

	prepareQueryString(query) {
		let saveValue = ''
		if (query === undefined || query === null || query.length === 0) {
			return
		}
		let arrQString = []

		query.map(item => {
			if (MyValidator.isAlphanumeric(item.value)) {
				saveValue = this.getSaveValue(item.value)
				switch (item.name) {
					case 'q':
						if (MyValidator.isValidYear(saveValue)) {
							arrQString.push(`year=${saveValue}`)
						} else {
							arrQString.push(`q=${saveValue}`)
						}
						break
					case 'author':
						arrQString.push(`author=${this.getSaveValue(item.value)}`)
						break
				}
			}
		})
		if (arrQString.length === 0) {
			return
		}
		this.queryString = arrQString.join('&')
		this.url += '?' + this.queryString
	}
	getData() {
		if (this.queryString === null) {
			return new Promise((resolve, reject) => {
				reject({ message: MyERRORS.INVALID_QUERY_STRING })
			})
		}
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

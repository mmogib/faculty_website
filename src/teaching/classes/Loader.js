const fetch = require('node-fetch')
const {parseString} = require('xml2js');

const Model = require('./Model')

class DataLoader {
	constructor(url, table, fields) {
		this.url = url
		this.Model = new Model(table, fields)
	}

	// return XML response
	loadData() {
		return new Promise((res, rej) => {

			fetch(this.url)
				.then(res => res.text())
				.then(body => {
					//console.log(body)
					
					//let data = this.getData(body)
					parseString(body, {trim: true}, function (err, result) {
						if (err) {
							rej('No Data Found ..')
							
						} else {
							//console.log(result)
							res(result)
						}
					});
					
				})
		})
	}

	//
	getData(resp) {
		if (!resp) {
			return null
		}
		return this.xmlToJson(resp)
		/*
		let temArrList = []
		let tempRanks = {}
		let $xmlDoc = $(resp)
		let $xmlData = $xmlDoc.find(this.Model.table)
		for (let index = 0; index < $xmlData.length; index++) {
			let tempObj = {}
			this.Model.fields.forEach(fld => {
				switch (fld.type) {
					case 'text':
						tempObj[fld.name] = this.getFieldText($($xmlData[index]).find(fld.name))
						break
					case 'array':
						tempObj[fld.name] = this.getFieldArray($($xmlData[index]), fld.name)
						break
				}
			})

			temArrList.push(tempObj)
		}

		return temArrList*/
	}

	getFieldText(field) {
		return field.text()
	}

	getFieldArray(fldArr, fieldName) {
		let tempArr = []
		let fldArrValues = $(fldArr).find(fieldName)
		for (let arrIndex = 0; arrIndex < fldArrValues.length; arrIndex++) {
			tempArr.push($(fldArrValues[arrIndex]).text())
		}
		return tempArr
	}

	xmlToJson(resp) {
		let numberOfFields = this.Model.fields.length
		if (numberOfFields === 0) {
			return []
		}
		// this is an array of rows for example publication
		const $ = require('jquery')(resp)
		let xmlDoc = $(resp).find(this.Model.table)
		let wholeArray = []
		let numberOfRows = xmlDoc.length

		for (let i = 0; i < numberOfRows; i++) {
			let row = {}
			for (let j = 0; j < numberOfFields; j++) {
				let fieldAsArray = $(xmlDoc[i]).find(this.Model.fields[j].name)
				let fieldArr = []
				for (let k = 0; k < fieldAsArray.length; k++) {
					let fieldObj = {}
					let field = fieldAsArray[k]
					let arrayAttrs = []
					if (this.Model.fields[j].attrs) {
						arrayAttrs = this.getAttrs(field).filter(tempAttrObj => {
							return this.attributeExists(this.Model.fields[j].attrs, tempAttrObj)
						})
					}
					fieldObj['value'] = $(field).text()
					if (arrayAttrs.length > 0) {
						arrayAttrs.forEach(obj => {
							fieldObj[obj.name] = obj.value
						})
					}
					fieldArr.push(fieldObj)
				}
				if (fieldArr.length === 1) {
					row[this.Model.fields[j].name] = fieldArr[0]
				} else {
					row[this.Model.fields[j].name] = fieldArr
				}
			}
			wholeArray.push(row)
		}

		return wholeArray
	}

	attributeExists(fieldAttrs, arrayAttrsObject) {
		let check = false
		fieldAttrs.forEach(checkAttr => {
			if (checkAttr === arrayAttrsObject.name) {
				check = true
			}
		})
		return check
	}
	getAttrs(obj) {
		let attrs = []
		let attrsObj = obj.attributes
		//console.log(attrsObj.length)
		if (attrsObj.length > 0) {
			for (let i = 0; i < attrsObj.length; i++) {
				let temp = {}
				attrs.push({ name: attrsObj[i].name, value: attrsObj[i].value })
			}
		}
		return attrs
	}
}

module.exports = DataLoader

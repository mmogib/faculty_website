const fetch = require('node-fetch')

const key = '6eca4b618b765fc758752e457a373110'
const getPublicationsByAuthorId = (id,limit) => {
	const url = `http://api.elsevier.com/content/search/scopus?facets=authname(count=20)&count=${limit}&query=AU-ID%28${id}%29&apiKey=${key}`
		return new Promise((resolve, reject) => {
		fetch(url)
			.then(response => resolve(response.json()))
			//.then(json => json['search-results']))
			//.then(json => console.log(json))
			.catch(error => reject(error))
	})
}

module.exports = {
	getPublicationsByAuthorId
}

const fetch = require('node-fetch')

const key = '6eca4b618b765fc758752e457a373110'
const getPublicationsByAuthorId = (id,limit=200) => {

	const query=[
		//`facets=authname(count=20)`,
		`count=${limit}`,
		`query=AU-ID%28${id}%29`,
		//`view=COMPLETE`,
		`field=prism:pageRange,author,citedby-count,prism:publicationName,prism:coverDisplayDate,prism:doi,dc:title`,
		`apiKey=${key}`		
	]
	//const url =`https://api.elsevier.com/content/author/author_id/${id}?apiKey=${key}`
	const url = `http://api.elsevier.com/content/search/scopus?${query.join('&')}`
		return new Promise((resolve, reject) => {
		fetch(url)
			.then(response => {
				resolve(response.json())
			})
			//.then(json => json['search-results']))
			//.then(json => console.log(json))
			.catch(error => reject(error))
	})
}

const getCitedByUrl=(url)=>{
	let tempUrl = 'https://'+url.split('://')[1]
	return new Promise((resolve, reject) => {
		fetch(`${tempUrl}`)
			.then(response => resolve(response))
			//.then(json => json['search-results']))
			//.then(json => console.log(json))
			.catch(error => reject(error))
	})
}
module.exports = {
	getPublicationsByAuthorId,
	getCitedByUrl
}

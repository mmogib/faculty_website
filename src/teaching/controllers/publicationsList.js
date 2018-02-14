import Publications from '../models/PublicationsModel'
import displayAll from '../components/PublicationsComponent'
import MyValidator from '../classes/MyValidator'
import { dirname } from 'path'
import spinner from '../classes/spinner'

let dataArray = []
let displayDiv = document.querySelector('#mathPublicationsDiv')
$(document).ready(() => {
	loadPublications([{ name: 'q', value: new Date().getFullYear() + '' }])
})

const setUpHandlers = () => {
	let searchValue = ''
	let searchValueObj = document.querySelector('#mathPublicationsSearchValue')
	searchValueObj.addEventListener('change', e => {
		e.preventDefault()
		searchValue = e.target.value
	})
	let searchBtn = document.querySelector('#mathPublicationsSearchBtn')
	searchBtn.addEventListener('click', e => {
		e.preventDefault()
		if (MyValidator.isValidYear(searchValueObj.value)) {
			loadPublications([{ name: 'q', value: searchValueObj.value }])
		} else {
			let pubErrorDiv = document.getElementById('publicationErrorDiv')
			pubErrorDiv.innerHTML = 'Invalid request!'
			pubErrorDiv.classList.remove('hide')
			setInterval(
				() => {
					pubErrorDiv.classList.add('hide')
					pubErrorDiv.innerHTML = ''
				},
				3000,
				pubErrorDiv
			)
		}
	})
}

const loadPublications = queryString => {
	displayDiv.innerHTML = `<div> Loading ... </div>`
	displayDiv.appendChild(spinner.el)
	const allData = new Publications(queryString)

	allData
		.getData()
		.then(data => {
			dataArray = data
			const Display = new displayAll(dataArray)
			displayDiv.innerHTML = Display.dispLay()
			setUpHandlers()
		})
		.catch(err => {
			displayDiv.innerHTML = `<div class="alert alert-warning">  ${err.message} </div>`
		})
}

import { getPublicationsByAuthorId, getCitedByUrl } from './api/scopus'
import {
	getBasicData,
	getCourseFiles,
	getOfficeHours,
	getSchedule
} from './api/teaching'

const aid = '55059142500'
const myid = '36135217900'

const id = document.getElementById('scopusId').dataset.scopusId
const username = document.getElementById('username').dataset.userId
const publicationId = document.getElementById('ScopusPublications')
const teachingDiv = document.getElementById('teaching')
//const profilePicture = document.getElementById('profile-picture')
let profile = null

//const aboutMeDiv = document.getElementById('aboutMeDiv')

const authorName = document.getElementById('author-name')
//const researchInterests = document.querySelector('#researchInterests div')

const getAuthors = authors => {
	let temp = []
	authors.forEach(a => {
		temp.push(a.authname)
	})
	return temp.join(', ')
}



getBasicData(username)
	.then(data => {
		//console.log(data)
		profile = {}
		profile = data
		buildFirstPage()
	})
	.catch(error => console.log(error))

if (publicationId) {
	const limit = document.getElementById('ScopusPublications').dataset.limit
	/*publicationId.addEventListener('click',e=>{
		<strong>(<a name="prims:url" href="${publications[key]['prism:url']}">cited by</a>: 
					${publications[key]['citedby-count']})</strong>
					,
		if (e.target.name==='prims:url'){
			e.preventDefault()
			console.log(e.target.href)
			getCitedByUrl(e.target.href).then(data=>console.log('data',data))
			.catch(error=>console.log('error',error))
			
		}
	})*/
	getPublicationsByAuthorId(id, limit).then(data => {
		//console.log(data)
		if (data['service-error']) {
			publicationId.innerHTML = `<div >Scopus Server Error: 
			${data['service-error'].status.statusText}</div>`
		} else {
			let html = '<ol>'
			const publications = data['search-results'].entry
			const keys = Object.keys(publications)
			keys.forEach(key => {
				let vol = publications[key]['prism:volume']
					? 'vol. '+ publications[key]['prism:volume']+', '
					: ''
				html += `<li> 
				${getAuthors(publications[key]['author'])},
				"${publications[key]['dc:title']}", 
                ${publications[key]['prism:publicationName']},
				${vol}
				pp. ${publications[key]['prism:pageRange']},
                ${publications[key]['prism:coverDisplayDate']},
				<strong>(cited by: ${publications[key]['citedby-count']})</strong>
                <a target="_blank" 
                rel="noopener noreferrer"
                href="https://doi.org/${publications[key]['prism:doi']}">download</a>

            </li>`
			})
			//console.log(publications)
			html += '</ol>'
			publicationId.innerHTML = html
		}
	})
}

if (teachingDiv) {
	document.querySelector('#teaching-loading').classList.add('hide')
	const coursesTaught = document.querySelector('#coursesTaught div')
	document.querySelector('#coursesTaught').classList.remove('hide')
	getCourseFiles(username)
		.then(data => {
			const values = Object.values(data)
			let html = `<table>
				<thead>
					<th> #</th>
					<th> Semester</th>
					<th> Course</th>
					<th> Section </th>
				</thead>
				<tbody>
			`
			values.forEach((course, i) => {
				html += `
				<tr>
					<td> ${i + 1}</td>
					<td> ${course.semester}</td>
					<td> ${course.course}</td>
					<td> ${course.section}</td>
				</tr>				
				`
			})
			html += `</tbody></table>`

			coursesTaught.innerHTML = html
		})
		.catch(error => (coursesTaught.innerHTML = error))

	const currentOH = document.querySelector('#currentOH div')
	document.querySelector('#currentOH').classList.remove('hide')

	getOfficeHours(username)
		.then(data => {
			const keys = Object.keys(data)
			let html = `<table>
				<thead>
					<th> Sunday</th>
					<th> Monday</th>
					<th> Tuesday</th>
					<th> Wednesday</th>
					<th> Thursday</th>
				</thead>
				<tbody>
				<tr>
			`
			keys.forEach(day => {
				if (day != 'Friday' && day != 'Saturday') {
					let temp = ''
					if (data[day].length > 0) {
						data[day].forEach(ohs => {
							ohs.forEach(oh => (temp += `${oh}<br>`))
						})
					}
					html += `
					<td> ${temp}</td>
				`
				}
			})
			html += `</tr></tbody></table>`

			currentOH.innerHTML = html
		})
		.catch(error => (currentOH.innerHTML = error))

	const currentSchedule = document.querySelector('#currentSchedule div')
	document.querySelector('#currentSchedule').classList.remove('hide')

	getSchedule(username)
		.then(data => {
			const values = Object.values(data)
			let html = `
			<table>
				<thead>
					<th> #</th>
					<th> Course</th>
					<th> Section</th>
					<th> Time</th>
					<th> Days</th>
					<th> Location</th>
				</thead>
				<tbody>
				
			`
			values.forEach((lec, i) => {
				html += `
				<tr>
					<td> ${i + 1}</td>
					<td> ${lec.code}</td>
					<td> ${lec.section}</td>
					<td> ${lec.period}</td>
					<td> ${lec.days}</td>
					<td> ${lec.location}</td>
				</tr>
							
				`
			})
			html += `</tbody></table>`

			currentSchedule.innerHTML = html
		})
		.catch(error => (currentSchedule.innerHTML = error))
}

const buildFirstPage = () => {
	//authorName.innerText = profile.name
	/*if (profilePicture) {
		profilePicture.src = profile.image
	}*/
	/*if (aboutMeDiv) {
		aboutMeDiv.innerHTML = `<img style="width: 20%;" src="./assets/images/spinner.gif"> loading ... `
		let html = `<ul>`
		html += `<li>Name: ${profile.name} </li>`
		html += `<li>Position: ${profile.rank} </li>`
		html += `<li>Email: ${profile.username} at kfupm dot edu dot sa</li>`
		html += `<li>Tel.: +966-13-860-${profile.phone}</li>`
		html += `<li>Office: ${profile.office}</li>`
		html += '</ul>'
		aboutMeDiv.innerHTML = html
	}*/
	/*
	if (researchInterests) {
		const ri = profile.research_interests

		let html = '<ol>'
		if (ri.length > 0) {
			ri.forEach(i => {
				html += `<li>${i}</li>`
			})
			html += '</ol>'
		}
		//researchInterests.style.display="block"
		researchInterests.innerHTML = html
	}*/
}

import FacultyModel from '../models/FacultyModel'
import myHtml from '../components/SingleFacultyComponent'
import MY_ERRORS from '../classes/MyErrors'
//import '../assets/css/facultyList.css'
//import Publications from '../Models/PublicationsModel'
//import displayAll from '../components/PublicationsComponent'
//import spinner from '../classes/spinner'
// ==============
import CfModel from '../models/CourseFileModel'
import CfComponent from '../components/CourseFileComponent'
//=============// ==============
//import ProjectModel from '../models/ProjectModel'
//import ProjectComponent from '../components/ProjectComponent'
import { createNewDiv } from '../helpers/index'
import { CFConfig, PHONE_PREFIX } from '../config/index'
//=============

let arrFaclutyList = []
let arrRanks = []
let activeCell = 'navigation_all'
let filter
let facultyData = new FacultyModel()

let mainDiv = document.querySelector('#faculty')
let facultyDiv,
	facultyDetails,
	facultyPublications,
	facultyCFiles,
	facultyProjects

const prepareDivs = () => {
	facultyDiv = createNewDiv('facultyListDiv', '', mainDiv)
	facultyDetails = createNewDiv('facultyDetailsDiv', 'hide', mainDiv)
	facultyPublications = createNewDiv('facultyPublicationsDiv', 'hide', mainDiv)
	facultyCFiles = createNewDiv('facultyCFilesDiv', 'hide', mainDiv)
	facultyProjects = createNewDiv('facultyProjectsDiv', 'hide', mainDiv)
}

/*
$(document).ready(() => {
	prepareDivs()
	loadFacultyData()
})*/

const startLoading = () => {
	facultyDiv.innerHTML = `<div> Loading ... </div>`
	facultyDiv.appendChild(spinner.el)
}
const setupHnadlers = () => {
	facultyDetails.addEventListener('click', e => {
		let targetId = e.target.id
		let tempArryOFLinks = targetId.split('_')
		let username = targetId.split('_')[tempArryOFLinks.length - 1].trim()
		switch (tempArryOFLinks[0]) {
			case 'Goback':
			case 'moredetaials':
				e.preventDefault()
				facultyDetails.className = 'hide'
				facultyDetails.innerHTML = ''
				facultyPublications.innerHTML = ''
				facultyCFiles.innerHTML = ''
				facultyProjects.innerHTML = ''
				document.getElementById('facultyDataDiv').className = 'show'
				break

			case 'Publications':
				e.preventDefault()
				facultyCFiles.innerHTML = ''
				facultyProjects.innerHTML = ''
				const queryString = [{ name: 'author', value: username }]
				facultyPublications.className = ''
				loadPublications(queryString, facultyPublications)
				break
			case 'CFiles':
				e.preventDefault()
				facultyPublications.innerHTML = ''
				facultyProjects.innerHTML = ''
				let filesQueryString = { name: 'instructor', value: username }
				facultyCFiles.className = ''
				loadCourseFiles(filesQueryString, facultyCFiles)
				break
			case 'Projects':
				e.preventDefault()
				facultyPublications.innerHTML = ''
				facultyCFiles.innerHTML = ''
				let projectQueryString = { name: 'instructor', value: username }
				facultyProjects.className = ''
				loadProjects(projectQueryString, facultyProjects)
				break
		}
	})
	facultyDiv.addEventListener('click', function(e) {
		let targetId = e.target.id
		if (targetId === undefined) {
			return
		}
		let tempArryOFLinks = targetId.split('_')

		switch (tempArryOFLinks[0]) {
			case 'navigation':
				filter = e.target.innerHTML
				startLoading()
				dispLayData(filterFacultyArray(filter))

				activeCell = e.target.id
				let activeNav = document.getElementById(activeCell)
				activeNav.parentNode.className = 'active'
				break
			case 'moredetaials':
				e.preventDefault()
				let facultyDataDiv = document.getElementById('facultyDataDiv')
				facultyDataDiv.className = 'hide'
				let chosenUsername = e.target.getAttribute('data-faculty-username')
				let facultyCard = insertFacultyData(facultyData.find(chosenUsername))
				myHtml(chosenUsername, facultyCard).then(endData => {
					facultyDetails.className = 'show'
					facultyDetails.innerHTML = endData
				})

				break
		}
	})
}

const loadProjects = (queryString, displayDiv) => {
	const projectsModel = new ProjectModel(queryString)
	displayDiv.innerHTML = ''
	displayDiv.appendChild(spinner.el)
	projectsModel.getData().then(data => {
		let projectComponent = new ProjectComponent(data)
		displayDiv.innerHTML = projectComponent.display()
	})
}
const loadCourseFiles = (queryString, displayDiv) => {
	const cfModel = new CfModel(queryString)
	displayDiv.innerHTML = ''
	displayDiv.appendChild(spinner.el)
	cfModel.getData().then(cfiles => {
		let cfComponent = new CfComponent(cfiles)

		displayDiv.innerHTML = cfComponent.display()
	})
}
const loadPublications = (queryString, displayDiv) => {
	const allData = new Publications(queryString)
	displayDiv.appendChild(spinner.el)
	allData
		.getData()
		.then(data => {
			const Display = new displayAll(data)
			displayDiv.innerHTML = Display.dispLayPublicationsOnly()
		})
		.catch(err => {
			displayDiv.innerHTML = `<div class="alert alert-warning">  ${
				err.message
			} </div>`
		})
}

const loadFacultyData = () => {
	startLoading()
	facultyData
		.getData()
		.then(data => {
			arrFaclutyList = data
			arrRanks = setRanks(data)
			dispLayData(arrFaclutyList)
			document.getElementById(activeCell).parentNode.className = 'active'
			setupHnadlers()
		})
		.catch(err => {
			facultyDiv.innerHTML = `<div class="alert alert-warning"> ${
				MY_ERRORS.DATA_NOT_AVAILABLE
			}</div>`
		})
}
const getDisplayHtml = arr => {
	let tempHtml = `<div id="facultyDataDiv"> `
	tempHtml += getNavBarDiv()
	arr.forEach(faculty => {
		tempHtml += insertContInRow(faculty)
	})
	tempHtml += `</div>`
	return tempHtml
}
const dispLayData = arr => {
	facultyDiv.innerHTML = getDisplayHtml(arr)
}

const filterFacultyArray = filter => {
	if (filter.trim() === 'All') return arrFaclutyList
	let temArry = arrFaclutyList.filter(faculty => {
		return faculty.rank.value === filter.trim()
	})

	return temArry
}

const setRanks = arrData => {
	let ranksOjb = {}
	arrData.forEach(faculty => {
		ranksOjb[faculty.rank.value] = faculty.rank.value
	})
	let values = Object.values(ranksOjb)
	let tempArr = []
	for (let i = 0; i < values.length; i++) {
		tempArr.push(values[i])
	}
	return tempArr
}

const getRiAsList = arr => {
	if (arr.length === 0) {
		return '<ul> <li>----</li> </ul>'
	}
	let html = '<ul>'
	for (let i = 0; i < arr.length; i++) {
		html += `<li>${arr[i].value}</li>`
	}
	html += '</ul>'
	return html
}

const getNavBarDiv = () => {
	return `<div id="facultyListNavBar">${getNavBar()} <hr style="border: 1px solid #007d40"></div>`
}

const getNavBar = () => {
	let tempNavHtml = ''
	tempNavHtml += `<li role="presentation" ><a id="navigation_all" href="#" >All </a></li>`
	arrRanks.forEach((value, index) => {
		tempNavHtml += `<li role="presentation" ><a id="navigation_${
			index
		}" href="#" >${value} </a></li>`
	})
	return `<div class="row row-margin-bottom">
	<div class="col-md-12 no-padding lib-item" data-category="view">
	<ul class="nav nav-tabs">
	${tempNavHtml}
  </ul>
  </div> 
  </div>`
}
const formatEmail = email => {
	let formedEmail = ''
	for (let i = 0; i < email.length; i++) {
		formedEmail += '&#' + email.charCodeAt(i) + ';'
	}
	return formedEmail
}

const insertContInRow = content => {
	const faculty = insertContInCard(content)

	return `<div class="row row-margin-bottom">${faculty} </div>
		<div class="row row-margin-bottom"><hr /></div>`
}
export const insertFacultyData = content => {
	const { username, name, rank, phone, office, email, web } = content
	const website = web.value.split(':')[1].trim()

	let emailFormed = formatEmail(email.value)
	return `
	<div class="row "><hr /></div>
	<div class="row ">
	<div class="col-md-4">
		Name:  <b> ${name.value} </b>(${rank.value})
	</div>	
	<div class="col-md-4">
		Email: ${emailFormed} (<a href="${website}" target="_blank" alt="${
		name.value
	} website">Website</a>)
	</div>	
	<div class="col-md-4">
		Phone: ${PHONE_PREFIX}${phone.value} - Office: ${office.value}
	</div>	
</div>
	<div class="row "><hr /></div>`
}
export const insertContInCard = content => {
	const {
		username,
		name,
		rank,
		researchInterest,
		phone,
		office,
		email,
		web,
		image
	} = content
	const website = web.value.split(':')[1].trim()
	const resI = getRiAsList(researchInterest)
	let emailFormed = formatEmail(email.value)

	return `
	<div class="col-md-12 no-padding lib-item" data-category="view">
			<div class="lib-panel">
					<div class="row box-shadow">
							<div class="col-md-4">
									<img class="profile-picture" 
									src="${image.value}" >
							</div>
							<div class="col-md-8">
									<div class="lib-row lib-header">
									${name.value}
											<div class="lib-header-seperator"></div>
									</div>
									<div class="lib-row lib-desc">
									<ul class="list-group">
									<li class="list-group-item">Rank: ${rank.value}</li>
									<li class="list-group-item">Research Interests: ${resI}</li>
									<li class="list-group-item">&#9742;: ${PHONE_PREFIX}${
		phone.value
	}, Office: &#9658; ${office.value}</li>
									<li class="list-group-item">&#9993; <a href="mailto:${emailFormed}">${
		emailFormed
	}</a></li>
									<li class="list-group-item"><span>&#8688;</span> 
									<a target="_blank" href="http:${website}">Personal Website</a> </li>
									<li class="list-group-item"> <span>&#8688;</span> 
									<a data-faculty-username="${username.value}" id="moredetaials_${
		username.value
	}" target="_blank" 
									href="#">more</a> </li>
								</ul>
									
								</div>
							</div>
					</div>
			</div>
	</div>`
}

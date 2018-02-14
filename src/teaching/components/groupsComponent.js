import { createNewDiv } from '../helpers'

export default class {
	constructor(div) {
		this.menuData = null
		this.committeesData = null
		this.academicYear = null
		this.mainDiv = document.getElementById(div)
		this.contentDivName = 'groupsContent'
		this.createStructure()
		this.contentDiv = document.getElementById(this.contentDivName)
	}

	createStructure() {
		this.mainDiv.innerHTML = `
        <div class="row">
            <div class="col-md-2 col-sm-6 col-xs-6" >
                <div id="groupsMenu" style="border-right: 4px solid #007d40;"></div>
            </div>
            <div class="col-md-10 col-sm-6 col-xs-6" >
            <div id="${this.contentDivName}" ></div>
            </div>
        </div>
    
    `
	}
	setMenuData(data) {
		this.menuData = data
	}
	setData(data) {
		this.committeesData = data
	}

	setAcademicYear(year) {
		this.academicYear = year
	}

	displayError(err) {
		this.contentDiv.innerHTML = `<div class="alert alert-warning"> ${
			err.message
		} </div>`
	}

	startLoading() {
		this.contentDiv.innerHTML = '<div> Loading, please wait ...'
	}
	stopLoading() {
		this.contentDiv.innerHTML = ''
	}

	displayIntro() {
		this.contentDiv.innerHTML = `
		<div class="container"> 
			<h3>Department Scientific Groups (${this.academicYear}) </h3>	
		<p>Please click on a semester 
		from the Menu on the left to display its groups</p></div>
		`
	}

	displayMenu() {
		let menuDiv = document.getElementById('groupsMenu')
		let html = '<ul class="nav nav-pills nav-stacked">'
		this.menuData.forEach(element => {
			html += `<li role="presentation"> <a id="semester_${element}" href="#${
				this.contentDivName
			}">${element}</a></div>`
		})
		html += '</ul>'
		menuDiv.innerHTML = html
	}

	displayGroups() {
		let html = '<div class="container center-text">'
		this.committeesData.forEach(element => {
			html += `<div class="table table-striped">${element}</div><hr />`
		})
		html += '</div>'
		this.displayIntro()
		this.contentDiv.innerHTML += html
	}
}

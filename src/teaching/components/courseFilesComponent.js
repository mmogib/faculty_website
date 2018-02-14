import '../assets/css/courseFiles.css'

export default class {
	constructor(div, data, course) {
		this.menuData = null
		this.course = course
		this.courseData = data
		this.semData = null
		this.mainDiv = div
		this.contentDivName = 'courseFilesMain'
		this.createStructure()
		this.contentDiv = document.getElementById(this.contentDivName)
	}
	setMenuData(data) {
		this.menuData = data
	}
	setCourseData(data) {
		this.courseData = data
	}
	setCourse(course) {
		this.course = course
	}
	setSemData(data) {
		this.semData = data
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
	getFiles(files) {
		if (!files) {
			return ''
		}
		let html = []
		files.forEach(file => {
			html.push(
				`<a data-key="${file.name}" href="${file.link}" target="_blank">${
					file.name
				}</a>`
			)
		})

		return html.join(' | ')
	}
	displayCourseSemesterDetails(sem) {
		this.startLoading()
		let html = ''
		this.contentDiv.innerHTML = ``
		this.semData.forEach((item, index) => {
			html += `
			<tr> 
				<td>${index + 1}</td>
				<td>${item.name}</td>
				<td>${this.getFiles(item.files)}</td>
				
			</tr>`
		})
		this.contentDiv.innerHTML = `
        <h2>Course Files of ${this.course} (Semester ${sem})</h2>
        <table class="table table-striped">
        <thead>
            <tr>
                <th>#</th>
                <th>Instructor</th>
				<th>
					<div class="mytooltip">
					Files
					<span class="mytooltiptext">
					F1,F2 :Final Exams<br> E1,E2 :Majors 
					<br /.> Q1, ... :Quizzes 
					<br />H1,... : Homework 
					<br /> S1,...: Syllabus
					</span>
					  </div> 
				</th>
				
            </tr>
        </thead>
        <tbody>
           ${html}
        </tbody>
      </table>
		`
	}
	displayCourse() {
		let moreLink = ''
		let html = ''
		this.contentDiv.innerHTML = ``
		this.courseData.semesters.forEach((item, index) => {
			moreLink =
				this.courseData.allFiles[item].length === 0
					? '...'
					: ` <a id="semester_${item}" href="#">More</a>`
			html += `
			<tr> 
				<td>${index + 1}</td>
				<td>${item}</td>
				<td>${this.getFiles(this.courseData.files[item])}</td>
				<td> ${moreLink}</td>
			</tr>`
		})
		this.contentDiv.innerHTML = `
        <h1>Course Files of ${this.course}</h1>
        <table class="table table-striped">
        <thead>
            <tr>
                <th>#</th>
                <th>Semester</th>
				<th>
					<div class="mytooltip">
					Files
					<span class="mytooltiptext">
					F1,F2 :Final Exams<br> E1,E2 :Majors 
					<br /.> Q1, ... :Quizzes 
					<br />H1,... : Homework 
					<br /> S1,...: Syllabus
					</span>
					  </div> 
				</th>
				<th>More...</th>
            </tr>
        </thead>
        <tbody>
           ${html}
        </tbody>
      </table>
        `
	}
	createStructure() {
		this.mainDiv.innerHTML = `
        <div class="row">
            <div class="col-md-2 col-sm-6 col-xs-6" >
                <div id="courseFilesMenu" style="border-right: 4px solid #007d40;"></div>
            </div>
            <div class="col-md-10 col-sm-6 col-xs-6" >
            <div id="${this.contentDivName}" ></div>
            </div>
        </div>
    
    `
	}

	displayIntro() {
		this.contentDiv.innerHTML = `
		<div class="container"> 
			<h3>Course Files</h3>	
		<p>Please click on a course 
		from the Menu on the left to display its course files</p></div>
		`
	}

	displayMenu() {
		let menuDiv = document.getElementById('courseFilesMenu')
		let html = '<ul class="nav nav-pills nav-stacked">'
		this.menuData.forEach(element => {
			html += `<li role="presentation"> <a id="course_${element.value}" href="#${
				this.contentDivName
			}">${element.value}</a></div>`
		})
		html += '</ul>'
		menuDiv.innerHTML = html
	}
}

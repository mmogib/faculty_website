//import '../assets/css/courseFiles.css'

export default class {
	constructor(data) {
		this.data = data
		this.filelink = `https://aisys.kfupm.edu.sa/WBKFUPM/departments/math`
	}

	display() {
		return `
        <h4>Course Files</h4>
        
        
            <div class="table-responsive">
                <table class="table table-striped table-hover ">
                    <thead>
                        <tr>
                            <th> Course </th>
                            <th> Section </th>
                            <th> Semester </th>
                            <th ><div class="mytooltip">Files
                            <span class="mytooltiptext">F1,F2 :Final Exams<br> E1,E2 :Majors <br /.> Q1, ... :Quizzes <br />H1,... : Homework <br /> S1,...: Syllabus</span>
                          </div> </th>
                        </tr>
                    </thead>
                    <tbody>
                            ${this.getCourseFileHtml()}
                    </tbody>
                </table>
        
            </div>
        `
	}

	getCourseFileHtml() {
		let html = ''
		this.data[0].course.forEach(row => {
			const {
				value,
				semester,
				code,
				number,
				section,
				instructorUserName,
				instructorFullName,
				links
			} = row
			//Q1pQ2pQ3pQ4pS1pF1pE1pE2p
			let filesLinks = []
			let filesLinksStr = ''
			if (value !== 'NONE') {
				filesLinks = value.split('p')
				let tempLinks = []
				filesLinks.forEach(link => {
					if (link.indexOf('d') > -1) {
						tempLinks = tempLinks.concat(link.split('d'))
					}
				})
				filesLinks = filesLinks.filter(link => {
					return link.indexOf('d') === -1
				})

				filesLinks.forEach(link => {
					filesLinksStr += `
                    <a href="${this.filelink}/${semester}/coursefile_data/${
						code
					}${number}_${semester}_${section}_${link}.pdf" target="_blank">${
						link
					} </a> 
                    `
				})
				tempLinks.forEach(link => {
					filesLinksStr += `
					<a href="${this.filelink}/${semester}/coursefile_data/${code}${number}_${
						semester
					}_${section}_${link}.doc" target="_blank">${link} </a> 
                    `
				})
			}
			html += `
            <tr>
                <td>${code} ${number}</td>
                <td>${section}</td>
                <td>${semester}</td>
                <td>${filesLinksStr}</td>

        </tr>`
		})

		return html
	}
}

const CFConfig = {
	files: [
		{ name: 'E', title: 'Major Exam', required: true },
		{ name: 'F', title: 'Final Exam', required: true },
		{ name: 'Q', title: 'Quiz', required: false },
		{ name: 'S', title: 'Syllabus', required: true },
		{ name: 'H', title: 'Homework', required: false },
		{ name: 'O', title: 'Other', required: false }
	],
	url:
		'https://aisys.kfupm.edu.sa/wbkfupm/departments/math/%1$s/coursefile_data/%2$s_%1$s_%3$s_%4$s.%5$s'
}

const URLS = {
	staffList: 'https://aisys.kfupm.edu.sa/publicsite/staffList.aspx',
	facultyList: 'https://aisys.kfupm.edu.sa/publicsite/facultyList.aspx',
	publicationList: 'https://aisys.kfupm.edu.sa/publicsite/publicationsList.aspx',
	projectsList: 'https://aisys.kfupm.edu.sa/publicsite/projectsList.aspx',
	courseFiles: 'https://aisys.kfupm.edu.sa/publicsite/courseFiles.aspx',
	committees: 'https://aisys.kfupm.edu.sa/publicsite/committees.aspx',
	groups: 'https://aisys.kfupm.edu.sa/publicsite/groups.aspx',
	schedule: 'https://aisys.kfupm.edu.sa/publicsite/oneFacultyDetails.aspx'
}

const PHONE_PREFIX = '+966-13-860-'

module.exports = { CFConfig, URLS, PHONE_PREFIX }

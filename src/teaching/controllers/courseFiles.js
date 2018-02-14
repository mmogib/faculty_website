import { sprintf } from 'sprintf-js'
import { CFConfig } from '../config'
import CfModel from '../models/CourseFileModel'
import CfilesComp from '../components/courseFilesComponent'

class CourseFiles {
	constructor() {
		this.data = null
		this.mainDiv = document.getElementById('mathCourseFilesDiv')
		this.course = null
		this.courses = null
		this.formatedData = null
		this.cfilesComp = new CfilesComp(this.mainDiv, null, null)
	}
	init() {
		const cfFileModel = new CfModel({ name: 'list', value: 'all' })
		this.cfilesComp.startLoading()
		cfFileModel
			.getData()
			.then(data => {
				this.data = data
				this.cfilesComp.stopLoading()
				this.cfilesComp.setMenuData(data[0].course)
				this.cfilesComp.displayMenu()
				this.cfilesComp.displayIntro()
				this.registerListeners()
			})
			.catch(err => {
				this.cfilesComp.stopLoading()
				this.cfilesComp.displayError(err)
			})
	}

	registerListeners() {
		this.mainDiv.addEventListener('click', e => {
			let linkId = e.target.id.split('_')
			const linkTagName = e.target.tagName

			if (linkId.length > 1) {
				//e.preventDefault()
				if (linkId[0] === 'course') {
					this.course = linkId[1]
					const cfModelCourse = new CfModel({ name: 'course', value: this.course })
					this.cfilesComp.startLoading()
					cfModelCourse.getData().then(data => {
						this.courses = data[0].course
						if (this.courses.length === undefined) {
							this.courses = [this.courses]
						}

						this.formatedData = this.formatData(this.courses)
						this.cfilesComp.setCourseData(this.formatedData)
						this.cfilesComp.setCourse(this.course)
						this.cfilesComp.displayCourse()

						//this.cfilesComp.stopLoading()
					})
				} else {
					const chosenSem = linkId[1]
					const semData = this.getSemDataByUserName(chosenSem)
					this.cfilesComp.setSemData(semData)
					this.cfilesComp.displayCourseSemesterDetails(chosenSem)
				}
			} else if (linkTagName === 'A') {
				console.log(linkTagName)
			} else {
				return
			}
		})
	}

	formatData(data) {
		let formatedData = {}
		formatedData['files'] = {}
		formatedData['allFiles'] = {}
		let tempSem = null
		let semesArray = []
		data.map(item => {
			let thisSem = item.semester
			if (thisSem !== tempSem) {
				tempSem = thisSem

				let arrayOfValues = this.getArrayOfValues(data, thisSem)
				let arrayOfAllFiles = this.getArrayOfFiles(arrayOfValues, thisSem, false)
				let arrayOfRequiredFiles = this.getArrayOfFiles(arrayOfValues, thisSem)
				formatedData['files'][thisSem] = arrayOfRequiredFiles
				formatedData['allFiles'][thisSem] = arrayOfAllFiles
				semesArray.push(thisSem)
			}
		})
		formatedData['semesters'] = semesArray
		semesArray = null
		return formatedData
	}
	sortSemDataByUserName(data) {
		let newData = null
		newData = data
		newData.sort((a, b) => {
			if (a.username < b.username) {
				return -1
			} else if (a.username > b.username) {
				return 1
			} else {
				return 0
			}
		})
		return newData
	}
	getInstructorsOfSem(data) {
		let tempUser = null
		let temArray = []
		let newData = this.sortSemDataByUserName(data)
		newData.map(value => {
			if (tempUser !== value.username) {
				tempUser = value.username
				temArray.push(tempUser)
			}
		})

		return temArray
	}

	getSemDataByUserName(sem) {
		let tempArray = []
		let allFiles = this.formatedData['allFiles'][sem]
		let newData = this.getInstructorsOfSem(allFiles)
		newData.forEach(user => {
			let files = [],
				name = ''
			allFiles.forEach(file => {
				if (user === file.username) {
					;(name = file.instructorName), files.push(file)
				}
			})
			tempArray.push({
				username: user,
				name,
				files
			})
		})
		return tempArray
	}

	getArrayOfFiles(data, sem, requiredOnly = true) {
		let tempArray = []
		let checkReqFiles = new Set()
		let requiredFiles = CFConfig.files
		data.map(value => {
			let currentPos = 0
			let tempStr = value.string
			for (let i = 0; i < tempStr.length; i++) {
				let exam = tempStr.substr(currentPos, i - currentPos)
				if (checkReqFiles.has(exam) && requiredOnly) {
					currentPos = i
					continue
				}

				let tempReq = requiredFiles.find(element => {
					//console.log(element, exam.substr(0, 1))
					if (element.required && element.name === exam.substr(0, 1)) {
						return true
					}
				})
				if ((tempReq !== undefined && requiredOnly) || !requiredOnly) {
					if (tempStr.charAt(i) === 'p') {
						checkReqFiles.add(exam)
						tempArray.push({
							name: exam,
							type: 'pdf',
							link: sprintf(
								CFConfig.url,
								sem,
								value.course,
								value.section,
								exam,
								'pdf'
							),
							links: value.links,
							username: value.username,
							instructorName: value.instructorName
						})
						currentPos = i + 1
					}
					if (tempStr.charAt(i) === 'd') {
						checkReqFiles.add(exam)
						tempArray.push({
							name: tempStr.substr(currentPos, i - currentPos).trim(),
							type: 'doc',
							link: sprintf(
								CFConfig.url,
								sem,
								value.course,
								value.section,
								exam,
								'doc'
							),
							links: value.links,
							username: value.username,
							instructorName: value.instructorName
						})
						currentPos = i + 1
					}
				}
			}
		})
		tempArray.sort((a, b) => {
			if (a.name < b.name) {
				return -1
			} else if (a.name > b.name) {
				return 1
			} else {
				return 0
			}
		})

		return tempArray
	}
	getArrayOfValues(data, sem) {
		let tempArray = []
		data.map(item => {
			if (item.semester === sem) {
				tempArray.push({
					string: item.value.split('NONE').join(''),
					section: item.section,
					course: item.course,
					username: item.instructorUserName,
					instructorName: item.instructorFullName,
					links: item.links
				})
			}
		})
		return tempArray
	}
}

let courseFiles = new CourseFiles()
courseFiles.init()

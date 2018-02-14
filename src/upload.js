const path = require('path')

const { mainBucket, dbref } = require('./firbase')

const {
	loadCourseFiles,
	getFacultyData,
	getFacultySchedule
} = require('./teaching/')

const upload_zip = username => {
	return new Promise((resolve, reject) => {
		mainBucket
			.upload(path.join(__dirname, `../archives/${username}.zip`))
			.then(result => resolve())
			.catch(error => reject(error))
	})
}
const uploadDataToFirebase = username => {
	const allData = {}
	getFacultyData(username)
		.then(data => data)
		.then(factData => {
			const keys = Object.keys(factData[0])
			const basicInfo = {}
			keys.forEach(key => {
				if (key != 'research_interests') basicInfo[key] = factData[0][key][0]
			})
			const research_interests =
				factData[0]['research_interests'][0]['researchInterest']
			const Interestskeys = Object.keys(research_interests)
			let research_interestsArr = []
			Interestskeys.forEach((key, value) => {
				research_interestsArr.push(research_interests[key]['_'])
			})
			basicInfo['research_interests'] = research_interestsArr
			allData['basicInfo'] = basicInfo

			return getFacultySchedule(username).then(d => d)
		})
		.then(schedule => {
			let obj = schedule['facultyTeaching']['schedule'][0]['course']
			let keys = Object.keys(obj)
			let scheduleArr = []
			keys.forEach(key => {
				scheduleArr.push(obj[key]['$'])
			})
			allData['schedule'] = scheduleArr

			obj = schedule['facultyTeaching']['officeHours'][0]['officeHour']
			keys = Object.keys(obj)
			let days = {
				Sunday: [],
				Monday: [],
				Tuesday: [],
				Wednesday: [],
				Thursday: [],
				Friday: [],
				Saturday: []
			}
			keys.forEach(key => {
				days[obj[key]['$'].day].push(obj[key]['_'])
			})
			allData['officeHours'] = days
			return loadCourseFiles(username).then(d => d)
		})
		.then(courseFiles => {
			let obj = courseFiles.courseFiles.course
			let keys = Object.keys(obj)
			let temp = {}
			let courseFilesArray = []
			keys.forEach(key => {
				temp = { ...obj[key].$, material: obj[key]._ }
				courseFilesArray.push(temp)
			})

			allData['courseFiles'] = courseFilesArray
			return allData
		})
		.then(data => {
			console.log('pushing data to firebase ...')
			dbref
				.child(`${username}/teaching`)
				.set(data)
				.then(() => console.log('pushed successfully.'))
				.catch(error => console.log('pushing fails because ', error))
		})
		.catch(error => {
			console.log("couldn'nt push bevause ", error.message)
		})
}


module.exports = {
	upload_zip,
	uploadDataToFirebase
}

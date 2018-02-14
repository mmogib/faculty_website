const FacultyModel = require('./models/FacultyModel')
const CfModel = require('./models/CourseFileModel')
const Schedule =require('./models/FacultyScheduleModle')

const getFacultySchedule = id =>{
    const schedule= new Schedule(id)
	return new Promise((resolve, reject) => {
		schedule.getSchedule()
			.then(data => {
				resolve(data)
			})
			.catch(error => reject(error))
	})
    
}
 const getFacultyData = username => {
	const Faculty = new FacultyModel()
	return new Promise((resolve, reject) => {
		Faculty.getData()
			.then(data => {
				resolve(Faculty.find(username))
			})
			.catch(error => reject(error))
	})
}

const loadCourseFiles = username => {
	const queryString = { name: 'instructor', value: username }
	const cfModel = new CfModel(queryString)

	return new Promise((resolve, reject) => {
		cfModel
			.getData()
			.then(cfiles => {
				resolve(cfiles)
			})
			.catch(err => reject(err))
	})
}

module.exports = {
		getFacultyData, 
		getFacultySchedule, 
		loadCourseFiles
	}




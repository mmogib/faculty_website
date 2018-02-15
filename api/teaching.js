import firebase from 'firebase'
const config = {
	apiKey: 'AIzaSyDjr8ltdVF_ELpUOrBIr6UZBzx85wcAwZA',
	authDomain: 'facutly-website-dev.firebaseapp.com',
	databaseURL: 'https://facutly-website-dev.firebaseio.com',
	projectId: 'facutly-website-dev',
	storageBucket: 'facutly-website-dev.appspot.com',
	messagingSenderId: '414496587763'
}

firebase.initializeApp(config)
const db = firebase.database().ref('site_requests')

export const getBasicData = username => {
	return new Promise((resolve, reject) => {
		db.child(`${username}/teaching/basicInfo`).on('value', (snapshot, error) => {
			if (error) reject('err')
			let data = {}
			snapshot.forEach(sn => {
				data[sn.key] = sn.val()
			})
			resolve(data)
		})
	})
}

export const getCourseFiles = username => {
	return new Promise((resolve, reject) => {
		db
			.child(`${username}/teaching/courseFiles`)
			.on('value', (snapshot, error) => {
				if (error) reject('err')
				let data = []
				snapshot.forEach(sn => {
					data.push(sn.val())
				})
				resolve(data)
			})
	})
}

export const getOfficeHours = username => {
	let days = {
		Sunday: [],
		Monday: [],
		Tuesday: [],
		Wednesday: [],
		Thursday: [],
		Friday: [],
		Saturday: []
	}
	return new Promise((resolve, reject) => {
		db
			.child(`${username}/teaching/officeHours`)
			.on('value', (snapshot, error) => {
				if (error) reject('err')
				snapshot.forEach(sn => {
					days[sn.key].push(sn.val())
				})
				resolve(days)
			})
	})
}


export const getSchedule = username => {
	return new Promise((resolve, reject) => {
		db
			.child(`${username}/teaching/schedule`)
			.on('value', (snapshot, error) => {
				if (error) reject('err')
				let data = []
				snapshot.forEach(sn => {
					data.push(sn.val())
				})
				resolve(data)
			})
	})
}

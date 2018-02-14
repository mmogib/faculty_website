import StaffModel from '../models/StaffModel'
import MY_ERRORS from '../classes/MyErrors'
import spinner from '../classes/spinner'
import StaffComponet from '../components/StaffComponent'

let arrStaffArray = []
let arrRanks = []
let staffDiv = document.querySelector('#staff')
let activeCell = 'nav_all'
let filter
const staffData = new StaffModel()
const StaffVeiw = new StaffComponet(staffDiv)

$(document).ready(() => {
	staffDiv.innerHTML = `<div> Loading ... </div>`
	staffDiv.appendChild(spinner.el)
	staffDiv.addEventListener('click', function(e) {
		let targetId = e.target.id
		if (targetId === undefined || targetId.substr(0, 3) !== 'nav') {
			return
		}

		filter = e.target.innerHTML
		staffDiv.innerHTML = `<div> Loading ... </div>`
		staffDiv.appendChild(spinner.el)
		StaffVeiw.setData(filterstaffArray(filter))
		StaffVeiw.dispLayData()

		activeCell = e.target.id
		let activeNav = document.getElementById(activeCell)
		activeNav.parentNode.className = 'active'
	})

	staffData
		.getData()
		.then(data => {
			arrStaffArray = data
			arrRanks = setRanks(data)

			StaffVeiw.setRanks(arrRanks)
			StaffVeiw.setData(data)
			StaffVeiw.dispLayData()
			document.getElementById(activeCell).parentNode.className = 'active'
		})
		.catch(err => {
			staffDiv.innerHTML = `<div class="alert alert-warning">  ${MY_ERRORS.DATA_NOT_AVAILABLE} ${err} </div>`
		})
})

const filterstaffArray = filter => {
	if (filter.trim() === 'All') return arrStaffArray
	let temArry = arrStaffArray.filter(staff => {
		return staff.rank.value === filter.trim()
	})

	return temArry
}

const setRanks = arrData => {
	let ranksOjb = {}
	arrData.forEach(staff => {
		ranksOjb[staff.rank.value] = staff.rank.value
	})
	let values = Object.values(ranksOjb)
	let tempArr = []
	for (let i = 0; i < values.length; i++) {
		tempArr.push(values[i])
	}
	return tempArr
}

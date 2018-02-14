import { URLS } from '../config'
import groupsComp from '../components/groupsComponent'

class Committees {
	constructor() {
		this.url = URLS.groups
		this.currentsem = new Date().getFullYear
		this.committees = null
		this.semesters = null
		this.academicYear = this.getCurrentSem()
		this.Comp = new groupsComp('mathGroupsDiv')
	}
	init() {
		this.Comp.startLoading()
		this.loadMenu().then(() => {
			this.Comp.setMenuData(this.semesters)
			this.Comp.setAcademicYear(this.academicYear)
			this.Comp.displayMenu()

			this.Comp.displayIntro()
			this.registerListeners()
			this.loadGroups().then(() => {
				this.Comp.setData(this.committees)
				this.Comp.displayGroups()
			})
		})
	}

	registerListeners() {
		this.Comp.mainDiv.addEventListener('click', e => {
			let linkId = e.target.id.split('_')
			const linkTagName = e.target.tagName

			if (linkId.length > 1) {
				//e.preventDefault()
				if (linkId[0] === 'semester') {
					const q = linkId[1]
					this.Comp.startLoading()
					this.loadGroups(q).then(() => {
						this.Comp.setData(this.committees)
						this.Comp.setAcademicYear(this.academicYear)
						this.Comp.displayGroups()
					})
				}
			} else if (linkTagName === 'A') {
				console.log(linkTagName)
			} else {
				return
			}
		})
	}

	getCurrentSem() {
		const currentDate = new Date()
		let academicFullYear = currentDate.getFullYear()
		if (currentDate.getMonth() < 10) {
			academicFullYear -= 1
		}
		const yearStr = academicFullYear.toString().substr(-2)
		return yearStr + '1-' + yearStr + '2'
	}

	makeArray(arrHTMLTags) {
		let tempArray = []
		for (let i = 0; i < arrHTMLTags.length; i++) {
			tempArray.push(arrHTMLTags[i].innerHTML)
		}
		return tempArray
	}

	loadMenu() {
		return new Promise((resolve, reject) => {
			$.ajax({
				type: 'GET',
				url: `${this.url}?AYEAR=${this.getCurrentSem()}`,
				dataType: 'html',
				success: resp => {
					this.semesters = this.makeArray($(resp).find('#groupsSemsASPXDIV a'))
					resolve(true)
				},
				error: err => {
					reject(err)
				}
			})
		})
	}
	loadGroups(q = null) {
		let qStr = q === null ? this.getCurrentSem() : q
		this.academicYear = qStr
		return new Promise((resolve, reject) => {
			$.ajax({
				type: 'GET',
				url: `${this.url}?AYEAR=${qStr}`,
				dataType: 'html',
				success: resp => {
					this.committees = this.makeArray($(resp).find('#groupsASPXDIV div'))
					resolve(true)
				},
				error: err => {
					reject(err)
				}
			})
		})
	}
}

const committees = new Committees()
committees.init()

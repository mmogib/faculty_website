import '../assets/css/staffList.css'
import { formatEmail } from '../helpers'
import { PHONE_PREFIX } from '../config'

export default class {
	constructor(div, data = null, ranks = null) {
		this.data = data
		this.div = div
		this.ranks = ranks
	}

	setData(data) {
		this.data = data
	}

	setRanks(ranks) {
		this.ranks = ranks
	}
	dispLayData() {
		this.div.innerHTML = this.getDisplayHtml(this.data)
	}

	getDisplayHtml(arr) {
		let tempHtml = this.getNavBarDiv()
		arr.forEach(staff => {
			tempHtml += this.insertContInRow(staff)
		})

		return tempHtml
	}

	getNavBarDiv() {
		return `<div id="staffListNavBar">${this.getNavBar()} <hr style="border: 1px solid #007d40"></div>`
	}

	getNavBar() {
		let tempNavHtml = ''
		tempNavHtml += `<li role="presentation" ><a id="nav_all" href="#" >All </a></li>`
		this.ranks.forEach((value, index) => {
			tempNavHtml += `<li role="presentation" ><a id="nav_${index}" href="#" >${
				value
			} </a></li>`
		})
		return `<div class="row row-margin-bottom">
        <div class="col-md-12 no-padding lib-item" data-category="view">
        <ul class="nav nav-tabs">
        ${tempNavHtml}
      </ul>
      </div> 
      </div>`

		return tempNavHtml
	}
	insertContInRow(content) {
		const staff = this.insertContInCard(content)

		return `<div class="row row-margin-bottom">${staff} </div>
        <div class="row row-margin-bottom"><hr /></div>`
	}

	insertContInCard(content) {
		const { username, name, rank, phone, office, email, image } = content
		let emailFormed = formatEmail(email.value)

		return `
        <div class="col-md-12 no-padding lib-item" data-category="view">
                <div class="lib-panel">
                        <div class="row box-shadow">
                                <div class="col-md-4">
                                        <img class="img-thumbnail" src="${
																																									image.value
																																								}">
                                </div>
                                <div class="col-md-8">
                                        <div class="lib-row lib-header">
                                        ${name.value}
                                        <div class="lib-header-seperator"></div>
                                        </div>
                                        <div class="lib-row lib-desc">
                                            <ul class="list-group">
                                            <li class="list-group-item">Rank: ${
																																													rank.value
																																												}</li>
                                            <li class="list-group-item">&#9742;:  ${
																																													PHONE_PREFIX
																																												}${phone.value}, Office: &#9658; ${
			office.value
		}</li>
                                            <li class="list-group-item">&#9993; <a href="mailto:${
																																													emailFormed
																																												}">${emailFormed}</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                        </div>
                </div>
        </div>`
	}
}

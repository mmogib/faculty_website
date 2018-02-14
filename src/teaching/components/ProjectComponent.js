import validator from 'validator'
export default class {
	constructor(data) {
		this.data = data
	}

	display() {
		return `
        <h4>Projects</h4>
        
        
            <div class="table-responsive">
                <table class="table table-striped table-hover ">
                    <thead>
                        <tr>
                            <th> # </th>
                            <th> Ref </th>
                            <th> Title </th>
                            <th> Members </th>
                            <th> Grant </th>
                            <th> Sponsor </th>
                            <th> Starts </th>
                            <th> Duraion </th>
                            <th> Status </th>
                            </tr>
                    </thead>
                    <tbody>
                            ${this.getProjectsHtml()}
                    </tbody>
                </table>
        
            </div>
        `
	}

	getProjectsHtml() {
		let html = ''
		this.data.forEach((row, index) => {
			const { member, title, duration } = row
			const { value, ref, sponsor, grant, status } = title
			const { startMonth, startYear } = duration
			let membersHtml = ''
			if (!member[0]) {
				membersHtml += `${member.value} (${member.type})`
			} else {
				member.forEach(mem => {
					membersHtml += `${mem.value} (${mem.type}), `
				})
			}
			html += `
            <tr>
                <td>${index + 1}</td>
                <td>${ref}</td>
                <td> ${value} </td>
                <td> ${membersHtml} </td>
                <td> ${grant} </td>
                <td> ${sponsor} </td>
                <td> ${startMonth} - ${startYear} </td>
                <td> ${duration.value} </td>
                <td> ${status} </td>

        </tr>`
		})

		return html
	}
}

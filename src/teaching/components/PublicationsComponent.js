export default class {
	constructor(data) {
		this.data = data
	}
	getSearchForm() {
		return `
        <div class="row">
        <div class="col-md-offset-2 col-md-8 col-md-offset-2 ">
            <div class="input-group">
            <input id="mathPublicationsSearchValue" type="text" class="form-control" 
            placeholder="So far you can only search by year, ex. 2016">
            <span class="input-group-btn">
            <button id="mathPublicationsSearchBtn" class="btn btn-default" type="button">Search</button>
            </span>
            </div>
            </div>
        </div>
    <div>
    <div class="row" style="padding: 10px;">
        <div class="col-md-offset-2 col-md-8 col-md-offset-2">
            <div class="alert alert-danger hide" id="publicationErrorDiv"></div>
        </div>
    </div>`
	}
	getListOfPublicationsHtml(arr) {
		let tempHtml = `
        
        <div class="row">
            <div class="col-md-12 ">
        <table class="table table-hover table-responsive"> 
        <thead> 
            <tr> 
                <th>#</th> 
                <th>Title</th> 
                <th>Year</th> 
                <th>Status</th> 
                <th>Authors</th> 
            </tr> 
        </thead>
        <tbody>`

		arr.forEach((row, index) => {
			row.sno = index + 1
			tempHtml += this.insertContInRow(row)
		})

		return tempHtml + '</tbody> </table> </div></div>'
	}
	getDisplayHtml(arr) {
		return this.getSearchForm() + '' + this.getListOfPublicationsHtml(arr)
	}

	dispLay() {
		return this.getDisplayHtml(this.data)
	}
	dispLayPublicationsOnly() {
		return this.getListOfPublicationsHtml(this.data)
	}
	insertContInRow(content) {
		const { sno, ref, status, author, year } = content
		return `<tr> 
            <td scope="row">${sno}</td> 
            <td>${ref.value}</td> 
            <td>${year.value}</td> 
            <td>${status.value}</td> 
            <td>${this.getAuthors(author)}</td> 
        </tr> `
	}

	getAuthors(authors) {
		let tempHtml = []
		for (let i = 0; i < authors.length; i++) {
			if (authors[i].authorId !== 'NoAuthors') {
				tempHtml.push(authors[i].value)
			}
		}
		return tempHtml.join(', ')
	}
}

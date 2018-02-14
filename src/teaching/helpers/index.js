const formatEmail = email => {
	let formedEmail = ''
	for (let i = 0; i < email.length; i++) {
		formedEmail += '&#' + email.charCodeAt(i) + ';'
	}
	return formedEmail
}

function createNewDiv(id, classname = '', mainDiv) {
	let tempDiv = document.createElement('div')
	tempDiv.id = id
	tempDiv.className = classname
	mainDiv.appendChild(tempDiv)
	return document.getElementById(id)
}

export { formatEmail, createNewDiv }

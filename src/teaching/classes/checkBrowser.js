function msCheck() {
	var ua = window.navigator.userAgent
	var msie = ua.indexOf('MSIE ')
	var MathContentDiv = document.getElementById('MathContentErrorDiv')

	if (msie > 0) {
		// If Internet Explorer, return version number
		MathContentDiv.innerHTML =
			"<div class='alert alert-danger'>Please use a different browser</div>"
	}
}
msCheck()

let html = `

  <div class="tab-pane fade" id="projects">
	<br /><br />

	<h4>Projects</h4>

  <div class="table-responsive">
	
	<table class="table table-striped table-hover ">
	  <thead>
	    <tr>
		<th >#</th>	
       	<th >Title</th>
        <th>PI/Coordinaor</th>
       	<th> Members</th>
       	<th> Sponsor</th>
       	<th> Grant </th>
       	<th> Ref #</th>
       	<th>S-Date</th>
       	<th>E-Date</th>
       	<th>Month</th>
       	<th>Status </th>
	  </tr>
	  </thead>
	  <tbody>
	  
     
     <tr>
       <td>1</td>
       <td>Generalized Nonstandard Hulls of locally convex spaces and Colombeau's theory of generalized functions.</td>
       <td><a href='Search_ShowAllProjects.aspx?VATID=khelifa' target=_new>Khalfallah, A. K.</a> </td>
       <td></td>
       <td>KFUPM </td>
       <td>Internal Research </td>
       <td>IN121034</td>
       <td>Mar 2013</td>
       <td>Nov 2014</td>
       <td>21</td>
       <td>In Progress </td>
     </tr>
       
     
     <tr>
       <td>2</td>
       <td>A New Nonstandard Topology and F-asymptotic hulls</td>
       <td><a href='Search_ShowAllProjects.aspx?VATID=khelifa' target=_new>Khalfallah, A. K.</a> </td>
       <td></td>
       <td>KFUPM </td>
       <td>Internal Research </td>
       <td>IN111038</td>
       <td>May 2012</td>
       <td>Oct 2013</td>
       <td>18</td>
       <td>Completed </td>
     </tr>
       
    </tbody>
	</table> 
	
	
	
	
	
 </div>    
 <!-- END -->  
</div>
  

  </div>







  


`
import DataLoader from '../classes/Loader'

const xmlURL = 'https://aisys.kfupm.edu.sa/publicsite/oneFacultyDetails.aspx'

const fields = [
	{
		name: 'course',
		attrs: ['code', 'section', 'period', 'location', 'activity', 'days']
	},
	{ name: 'officeHour', attrs: ['day'] },
	{ name: 'ohNotes' }
]

const loadFacultyInfo = (username, facultyCard) => {
	const allData = new DataLoader(
		xmlURL + '?ATID=' + username,
		'facultyTeaching',
		fields
	)
	return new Promise((resolve, reject) => {
		allData
			.loadData()
			.then(data => {
				//dispLayData(dataArray)
				//setUpHandlers()
				let returnedHtml = ''
				returnedHtml += getOneFacultyNav(username)
				returnedHtml += getScheduleHtml(data[0].course, username, facultyCard)
				returnedHtml += getOfficeHoursHtml(data[0].officeHour, data[0].ohNotes)

				resolve(returnedHtml)
			})
			.catch(err => {
				reject(err)
			})
	})
}

const getDayIndex = day => {
	switch (day) {
		case 'Sunday':
			return 0
			break
		case 'Monday':
			return 1
			break
		case 'Tuesday':
			return 2
			break
		case 'Wednesday':
			return 3
			break
		case 'Thursday':
			return 4
			break
	}
}

const getOfficeHoursHtml = (ohs, ohNotes) => {
	let days = [[], [], [], [], []]
	for (let i = 0; i < ohs.length; i++) {
		let { day, value } = ohs[i]
		day = getDayIndex(day)
		for (let j = 0; j < 5; j++) {
			if (day === j) {
				days[day].push(value)
			}
		}
	}

	return `
 
<h3> Office Hours </h3> 

<table class="table table-striped table-hover ">
 <thead>
    <tr>
    <th>Sunday</th>
    <th>Monday</th>
    <th>Tuesday</th>
    <th>Wednesday</th>
    <th>Thursday</th>
    </tr>
	<tr>
		<td>${days[0].join('<br />')} </td>
		<td>${days[1].join('<br />')} </td>
		<td>${days[2].join('<br />')} </td>
		<td>${days[3].join('<br />')} </td>
		<td>${days[4].join('<br />')} </td>
    </tr>
    </thead>
 <tbody>
   

   </TBODY>

 </TABLE>

<p> Remark : ${ohNotes.value}</p>

</div>    
<!-- END -->  
</div>
`
}

const getOneFacultyNav = username => {
	return `
	
		<div id="onFacultyNavBar"> 
		
		<ul class="nav nav-pills nav-justified"> 
			<li role="presentation" ><a href="#" id="Publications_${
				username
			}">Publications</a></li> 
				<li role="presentation"><a href="#" id="Projects_${username}">Projects</a></li> 
				<li role="presentation"><a href="#" id="CFiles_${
					username
				}">Course File</a></li> 
		</ul> 
		</div>
		`
}
const userInfoHtml = user => {
	return `
  <table class="table table-striped table-hover ">
  <thead>
  
  
    <tr>
     <th>Name: Dr.Khalfallah, A. K.</th>
     <th>Phone: 3798</th>
     <th>Off. Loc: 5-201-5</th>
     <th>Email: </B><a href='mailto:khelifa@kfupm.edu.sa'>khelifa@kfupm.edu.sa</a></th>
  </tr>
  </thead>
  <tbody>
  
 
   </tbody>
 </table> 
  `
}
const getScheduleHtml = (schedule, user, facultyCard) => {
	let rows = ''
	let counter = 1

	for (let i = 0; i < schedule.length; i++) {
		const { code, section, period, location, activity, days } = schedule[i]
		rows += `   
  <TR> 
      <TD >${counter++} </TD> 
    <TD  >${code}</TD> 
    <TD >${section} </TD>
    <TD >${period} </TD>
    <TD >${location} </TD>
    <TD >${activity} </TD>
    <TD >${days} </TD>
    </TR> `
	}

	let tempHtml = `
  <a href="#" class="btn btn-primary" role="button" aria-pressed="true" id="Goback_${
			user
		}"> 
  Go Back 
  </a>
	<div class="row" >${facultyCard}</div>
  <h3> Teaching Assignment</h3> 
 <table class="table table-striped table-hover ">
 <thead>

    <tr>
    <th>#</th>
    <th>Course</th>
    <th>Section</th>
    <th>Period</th>
    <th>Location</th>
    <th>Activity</th>
      <th>Days</th>
  </tr>
  ${rows}
 </thead>
 <tbody>
 
 
    

  </tbody>
</table> `
	return tempHtml
}
export default loadFacultyInfo

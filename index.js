import { getPublicationsByAuthorId } from './api/scopus'


const aid = '55059142500'
const myid = '36135217900'

const id = document.getElementById('scopusId').dataset.scopusId
const username = document.getElementById('username').dataset.userId
const publicationId = document.getElementById('ScopusPublications')
const coursesTaught = document.getElementById('coursesTaught')

if (publicationId){
    const limit = document.getElementById('ScopusPublications').dataset.limit
    getPublicationsByAuthorId(id,limit).then(data=>{
        let html ='<ol>'
        const publications = data['search-results'].entry
        const keys = Object.keys(publications)
        keys.forEach(key => {
            html+=`<li> 
                ${publications[key]['dc:title']}, 
                ${publications[key]['prism:publicationName']},
                ${publications[key]['prism:coverDisplayDate']},
                <strong>(cited by: ${publications[key]['citedby-count']})</strong>
                <a target="_blank" 
                rel="noopener noreferrer"
                href="https://doi.org/${publications[key]['prism:doi']}">download</a>

            </li>`
            
           
        });
        console.log(publications)
        html+='</ol>'
        publicationId.innerHTML=html
    })
    
}

if (coursesTaught) {
}

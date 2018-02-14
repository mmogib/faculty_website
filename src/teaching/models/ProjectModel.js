import BaseModel from '../classes/BaseModel'
import { URLS } from '../config/'

export default class extends BaseModel {
	constructor(queryString) {
		const url = URLS.projectsList + '?instructor=' + queryString.value
		const fields = [
			{
				name: 'member',
				attrs: ['id', 'type']
			},
			{
				name: 'duration',
				attrs: ['startMonth', 'startYear', 'endMonth', 'endYear']
			},
			{
				name: 'title',
				attrs: ['sponsor', 'grant', 'ref', 'status']
			}
		]

		super(url, 'project', fields)
	}
}

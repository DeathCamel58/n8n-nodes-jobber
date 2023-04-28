import type {INodeProperties} from 'n8n-workflow';

export const TimeSheetEntryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'get',
		required: true,
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a time sheet entry by its ID',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List time sheet entries',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'timeSheetEntry',
				],
			},
		},
	},
];

export const TimeSheetEntryFields: INodeProperties[] = [
	{
		displayName: 'idQueryName',
		name: 'idQueryName',
		type: 'hidden',
		default: 'timeSheetEntries',
		displayOptions: {
			show: {
				resource: [ 'timeSheetEntry' ],
			},
		},
	},
	{
		displayName: 'uniqueName',
		name: 'uniqueName',
		type: 'hidden',
		default: 'startAt',
		displayOptions: {
			show: {
				resource: [ 'timeSheetEntry' ],
			},
		},
	},
	{
		displayName: 'Time Sheet Entry Name or ID',
		name: 'timeSheetEntryID',
		type: 'options',
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getIds',
		},
		displayOptions: {
			show: {
				resource: [ 'timeSheetEntry' ],
				operation: [ 'get' ],
			},
		},
	},
	{
		displayName: 'How Many Records',
		name: 'timeSheetEntryQty',
		type: 'number',
		default: 10,
		description: 'How many records to return',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'timeSheetEntry' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'User ID',
		name: 'timeSheetEntryUserID',
		type: 'string',
		default: '',
		description: 'Only show time sheets related to given user ID',
		displayOptions: {
			show: {
				resource: [ 'timeSheetEntry' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Include Every Account Timer',
		name: 'timeSheetEntryIncludeAll',
		type: 'options',
		options: [
			{
				name: 'No Filter',
				value: '',
			},
			{
				name: 'Yes',
				value: 'true',
			},
			{
				name: 'No',
				value: 'false',
			},
		],
		default: '',
		description: 'Include from all users',
		displayOptions: {
			show: {
				resource: [ 'timeSheetEntry' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Is Approved',
		name: 'timeSheetEntryApproved',
		type: 'options',
		options: [
			{
				name: 'No Filter',
				value: '',
			},
			{
				name: 'Yes',
				value: 'true',
			},
			{
				name: 'No',
				value: 'false',
			},
		],
		default: '',
		description: 'Include from all users',
		displayOptions: {
			show: {
				resource: [ 'timeSheetEntry' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Minimal Time Sheet Entry Information',
		name: 'timeSheetEntryMinimal',
		type: 'boolean',
		default: true,
		description: 'Because listing returns numerous time sheet entries, listing all information for each result can ' +
			'quickly hit the rate limit. By selecting this, only the timeSheetEntry\'s name and ID will be returned.',
		displayOptions: {
			show: {
				resource: [ 'timeSheetEntry' ],
				operation: [ 'list' ],
			},
		},
	},
	// TODO: Add start after date filtering
	// TODO: Add start before date filtering
	// TODO: Add active on date filtering
];

// This contains the full list of timeSheetEntry fields
const fullTimeSheetEntryDetails = `
approved
approvedBy {
	id
}
client {
	id
}
endAt
finalDuration
id
job {
	id
}
label
labourRate
note
paidBy {
	id
}
startAt
ticking
user {
	id
}
visit {
	id
}
visitDurationTotal
`;

/**
 * Returns the GraphQL query string for the given timeSheetEntry
 * @param id The ID of the timeSheetEntry
 */
export function TimeSheetEntryGenerateGetQuery(id: string) {
	return `
		query TimeSheetEntryQuery {
			timeSheetEntry(id: "${id}") {
				${fullTimeSheetEntryDetails}
			}
		}
		`;
}

/**
 * Returns the GraphQL query string with the given settings
 * @param qty The number of timeSheetEntries to return
 * @param timeSheetEntryMinimal Should we only get minimal information?
 * @param assignedTo List only timeSheetEntries related to client with given ID
 * @param includeEveryAccountTimer List only timeSheetEntries with given number
 * @param isApproved List only timeSheetEntries that are approved
 */
export function TimeSheetEntryGenerateListQuery(
	qty: number,
	timeSheetEntryMinimal: boolean = false,
	assignedTo: string = '',
	includeEveryAccountTimer: string = '',
	isApproved: string = ''
) {
	// Build the arguments for the query
	let args = `first: ${qty}\n`;
	let filterAttributes = '';
	if (assignedTo != '' || includeEveryAccountTimer != '' || isApproved != '') {
		filterAttributes += 'filter: {\n'
		if (assignedTo != '') {
			filterAttributes += `assignedTo: "${assignedTo}",\n`;
		}
		if (includeEveryAccountTimer != '') {
			filterAttributes += `includeEveryAccountTimer: ${includeEveryAccountTimer},\n`;
		}
		if (isApproved != '') {
			filterAttributes += `isApproved: ${isApproved},\n`;
		}
		filterAttributes += '}';
	}
	args += filterAttributes;

	return `
		query TimeSheetEntryQuery {
			timeSheetEntries(
				${args}
			) {
				nodes {
					${timeSheetEntryMinimal ? 'id\nstartAt' : fullTimeSheetEntryDetails}
				}
			}
		}
		`;
}

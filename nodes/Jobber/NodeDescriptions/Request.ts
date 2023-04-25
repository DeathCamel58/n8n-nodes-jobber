import type {INodeProperties} from 'n8n-workflow';

export const RequestOperations: INodeProperties[] = [
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
				action: 'Get a request by its ID',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List requests',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'request',
				],
			},
		},
	},
];

export const RequestFields: INodeProperties[] = [
	{
		displayName: 'ID',
		name: 'requestID',
		type: 'string',
		default: '',
		description: 'Request ID',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'request' ],
				operation: [ 'get' ],
			},
		},
	},
	{
		displayName: 'Search Term',
		name: 'requestSearch',
		type: 'string',
		default: '',
		description: 'Search term to look for',
		displayOptions: {
			show: {
				resource: [ 'request' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'How Many Records',
		name: 'requestQty',
		type: 'number',
		default: 10,
		description: 'How many records to return',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'request' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Client ID',
		name: 'requestClient',
		type: 'string',
		default: '',
		description: 'Only return requests for given client ID',
		displayOptions: {
			show: {
				resource: [ 'request' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Property ID',
		name: 'requestProperty',
		type: 'string',
		default: '',
		description: 'Only return requests for given client ID',
		displayOptions: {
			show: {
				resource: [ 'request' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Status Filter',
		name: 'requestStatus',
		type: 'options',
		options: [
			{
				name: 'Archived',
				value: 'archived',
			},
			{
				name: 'Assessment Completed',
				value: 'assessment_completed',
			},
			{
				name: 'Completed',
				value: 'completed',
			},
			{
				name: 'Converted',
				value: 'converted',
			},
			{
				name: 'New',
				value: 'new',
			},
			{
				name: 'No Filter',
				value: '',
			},
			{
				name: 'Overdue',
				value: 'overdue',
			},
			{
				name: 'Today',
				value: 'today',
			},
			{
				name: 'Unscheduled',
				value: 'unscheduled',
			},
			{
				name: 'Upcoming',
				value: 'upcoming',
			},
		],
		default: '',
		description: 'Filter for: The status of the request to filter by',
		displayOptions: {
			show: {
				resource: [ 'request' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Minimal Request Information',
		name: 'requestMinimal',
		type: 'boolean',
		default: true,
		description: 'Because listing returns numerous requests, listing all request information for each result can ' +
			'quickly hit the rate limit. By selecting this, only the request\'s name and ID will be returned.',
		displayOptions: {
			show: {
				resource: [ 'request' ],
				operation: [ 'list' ],
			},
		},
	},
	// TODO: Add creation date filtering
	// TODO: Add updated date filtering
];

// This contains the full list of request fields
const fullRequestDetails = `
assessment {
	id
}
client {
	id
}
companyName
contactName
createdAt
email
id
jobberWebUri
jobs {
	nodes {
		id
	}
}
noteAttachments {
	nodes {
		id
	}
}
notes {
	nodes
}
phone
property {
	id
}
quotes {
	nodes {
		id
	}
}
referringClient {
	id
}
requestStatus
source
title
updatedAt
`;

/**
 * Returns the GraphQL query string for the given request
 * @param id The ID of the request
 */
export function RequestGenerateGetQuery(id: string) {
	return `
		query RequestQuery {
			request(id: "${id}") {
				${fullRequestDetails}
			}
		}
		`;
}

/**
 * Returns the GraphQL query string with the given settings
 * @param qty The number of properties to return
 * @param search The search term to use
 * @param requestMinimal Should we only get minimal information?
 * @param requestClient List only requests related to client with given ID
 * @param requestProperty List only requests related to client with given ID
 * @param requestStatus List only requests related to client with given ID
 */
export function RequestGenerateListQuery(
	qty: number,
	search: string,
	requestMinimal: boolean = false,
	requestClient: string = '',
	requestProperty: string = '',
	requestStatus: string = ''
) {
	// Build the arguments for the query
	let args = `first: ${qty}\n`;
	if (search) {
		args += `searchTerm: "${search}"\n`;
	}
	let filterAttributes = '';
	if (requestClient != '' || requestProperty != '' || requestStatus != '') {
		filterAttributes += 'filter: {\n'
		if (requestClient != '') {
			filterAttributes += `clientId: "${requestClient}",\n`;
		}
		if (requestProperty != '') {
			filterAttributes += `propertyId: "${requestProperty}",\n`;
		}
		if (requestStatus != '') {
			filterAttributes += `status: "${requestStatus}",\n`;
		}
		filterAttributes += '}';
	}
	args += filterAttributes;

	return `
		query RequestQuery {
			requests(
				${args}
			) {
				nodes {
					${requestMinimal ? 'id\ntitle' : fullRequestDetails}
				}
			}
		}
		`;
}

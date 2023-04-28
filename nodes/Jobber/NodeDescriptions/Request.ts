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
				name: 'Archive',
				value: 'archive',
				action: 'Archive a request by its ID',
			},
			{
				name: 'Create or Update',
				value: 'upsert',
				action: 'Create a new record or update the current one if it already exists upsert',
			},
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
			{
				name: 'Unarchive',
				value: 'unarchive',
				action: 'Unarchive a request by its ID',
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
		displayName: 'idQueryName',
		name: 'idQueryName',
		type: 'hidden',
		default: 'requests',
		displayOptions: {
			show: {
				resource: [ 'request' ],
			},
		},
	},
	{
		displayName: 'uniqueName',
		name: 'uniqueName',
		type: 'hidden',
		default: 'title',
		displayOptions: {
			show: {
				resource: [ 'request' ],
			},
		},
	},
	{
		displayName: 'Request Name or ID',
		name: 'requestID',
		type: 'options',
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getIds',
		},
		displayOptions: {
			show: {
				resource: [ 'request' ],
				operation: [ 'get', 'archive', 'unarchive' ],
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
		displayName: 'ID',
		name: 'requestID',
		type: 'string',
		default: '',
		description: 'The encoded ID of the request',
		displayOptions: {
			show: {
				resource: [ 'request' ],
				operation: [ 'upsert' ],
			},
		},
	},
	{
		displayName: 'contactName',
		name: 'requestContactName',
		type: 'string',
		default: '',
		description: 'Contact name for a request',
		displayOptions: {
			show: {
				resource: [ 'request' ],
				operation: [ 'upsert' ],
			},
		},
	},
	{
		displayName: 'Company Name',
		name: 'requestCompanyName',
		type: 'string',
		default: '',
		description: 'Company name for a request',
		displayOptions: {
			show: {
				resource: [ 'request' ],
				operation: [ 'upsert' ],
			},
		},
	},
	{
		displayName: 'Title',
		name: 'requestTitle',
		type: 'string',
		default: '',
		description: 'Title for for a request',
		displayOptions: {
			show: {
				resource: [ 'request' ],
				operation: [ 'upsert' ],
			},
		},
	},
	{
		displayName: 'Email',
		name: 'requestEmail',
		type: 'string',
		default: '',
		description: 'Email associated with a request',
		displayOptions: {
			show: {
				resource: [ 'request' ],
				operation: [ 'upsert' ],
			},
		},
	},
	{
		displayName: 'clientId',
		name: 'requestClientId',
		type: 'string',
		default: '',
		description: 'The ID of the client for whom the request is created',
		displayOptions: {
			show: {
				resource: [ 'request' ],
				operation: [ 'upsert' ],
			},
		},
	},
	{
		displayName: 'Source',
		name: 'requestSource',
		type: 'string',
		default: '',
		description: 'The source of the request',
		displayOptions: {
			show: {
				resource: [ 'request' ],
				operation: [ 'upsert' ],
			},
		},
	},
	{
		displayName: 'Phone',
		name: 'requestPhone',
		type: 'string',
		default: '',
		description: 'The phone number of the contact in the request',
		displayOptions: {
			show: {
				resource: [ 'request' ],
				operation: [ 'upsert' ],
			},
		},
	},
	{
		displayName: 'Property ID',
		name: 'requestPropertyId',
		type: 'string',
		default: '',
		description: 'The property associated with the request',
		displayOptions: {
			show: {
				resource: [ 'request' ],
				operation: [ 'upsert' ],
			},
		},
	},
	{
		displayName: 'Referring Client',
		name: 'requestReferringClient',
		type: 'string',
		default: '',
		description: 'The ID of the referring client, if this work request was referred',
		displayOptions: {
			show: {
				resource: [ 'request' ],
				operation: [ 'upsert' ],
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
				operation: [ 'list', 'archive', 'unarchive' ],
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
		filterAttributes += 'filter: {\n';
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

/**
 * Returns the GraphQL query string to upsert a request
 * @param id The encoded ID of the request
 * @param contactName Contact name for a request
 * @param companyName Company name for a request
 * @param title Title for a request
 * @param email Email associated with a request
 * @param clientId The ID of the client for whom the request is created
 * @param source The source of the request
 * @param phone The phone number of the contact in the request
 * @param propertyId The property associated with the request
 * @param referringClient The ID of the referring client, if this work request was referred
 * @param minimal Should we only get minimal information?
 */
export function RequestGenerateUpsert(
	id: string = '',
	contactName: string = '',
	companyName: string = '',
	title: string = '',
	email: string = '',
	clientId: string = '',
	source: string = '',
	phone: string = '',
	propertyId: string = '',
	referringClient: string = '',
	minimal: boolean = false,
) {
	// Build the arguments for the query
	let args = '';
	if (id) {
		args += `id: "${id}"\n`;
	}
	let attributes = '';
	if (
		contactName != '' ||
		companyName != '' ||
		title != '' ||
		email != '' ||
		clientId != '' ||
		source != '' ||
		propertyId != '' ||
		referringClient != ''
	) {
		attributes += 'attributes: {\n';
		if (contactName != '') {
			attributes += `contactName: "${contactName}",\n`;
		}
		if (companyName != '') {
			attributes += `companyName: "${companyName}",\n`;
		}
		if (title != '') {
			attributes += `title: "${title}",\n`;
		}
		if (email != '') {
			attributes += `email: "${email}",\n`;
		}
		if (clientId != '') {
			attributes += `clientId: "${clientId}",\n`;
		}
		if (source != '') {
			attributes += `source: "${source}",\n`;
		}
		if (phone != '') {
			attributes += `phone: "${phone}",\n`;
		}
		if (propertyId != '') {
			attributes += `propertyId: "${propertyId}",\n`;
		}
		if (referringClient != '') {
			attributes += `referringClient: "${referringClient}",\n`;
		}
		attributes += '}';
	}
	args += attributes;

	let mutation = `
		mutation RequestMutation {
			requestUpsert(
				${args}
			) {
				request {
					${minimal ? 'id\ntitle' : fullRequestDetails}
				}
				userErrors {
					message
					path
				}
			}
		}
		`;
	console.log(mutation);

	return mutation;
}

/**
 * Returns the GraphQL query string to archive a request
 * @param id The ID of the request
 * @param minimal Should we only get minimal information?
 */
export function RequestGenerateArchiveQuery(id: string, minimal: boolean = false) {
	return `
		mutation RequestMutation {
			requestArchive(requestId: "${id}") {
				request {
					${minimal ? 'id\ntitle' : fullRequestDetails}
				}
				userErrors {
					message
					path
				}
			}
		}
		`;
}

/**
 * Returns the GraphQL query string to archive a request
 * @param id The ID of the request
 * @param minimal Should we only get minimal information?
 */
export function RequestGenerateUnarchiveQuery(id: string, minimal: boolean = false) {
	return `
		mutation RequestMutation {
			requestUnarchive(requestId: "${id}") {
				request {
					${minimal ? 'id\ntitle' : fullRequestDetails}
				}
				userErrors {
					message
					path
				}
			}
		}
		`;
}

import type {INodeProperties} from 'n8n-workflow';

export const QuoteOperations: INodeProperties[] = [
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
				action: 'Get an quote by its ID',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List quotes',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'quote',
				],
			},
		},
	},
];

export const QuoteFields: INodeProperties[] = [
	{
		displayName: 'ID',
		name: 'quoteID',
		type: 'string',
		default: '',
		description: 'Quote ID',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'quote' ],
				operation: [ 'get' ],
			},
		},
	},
	{
		displayName: 'Search Term',
		name: 'quoteSearch',
		type: 'string',
		default: '',
		description: 'Search term to look for',
		displayOptions: {
			show: {
				resource: [ 'quote' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'How Many Records',
		name: 'quoteQty',
		type: 'number',
		default: 10,
		description: 'How many records to return',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'quote' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Client ID',
		name: 'quoteClient',
		type: 'string',
		default: '',
		description: 'Only return quotes for given client ID',
		displayOptions: {
			show: {
				resource: [ 'quote' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Quote Number',
		name: 'quoteNumber',
		type: 'string',
		default: '',
		description: 'Only return quotes with given number',
		displayOptions: {
			show: {
				resource: [ 'quote' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Status Filter',
		name: 'quoteStatus',
		type: 'options',
		options: [
			{
				name: 'Approved',
				value: 'approved',
			},
			{
				name: 'Archived',
				value: 'archived',
			},
			{
				name: 'Awaiting Response',
				value: 'awaiting_response',
			},
			{
				name: 'Changes Requested',
				value: 'changes_requested',
			},
			{
				name: 'Converted',
				value: 'converted',
			},
			{
				name: 'Draft',
				value: 'draft',
			},
			{
				name: 'No Filter',
				value: '',
			},
		],
		default: '',
		description: 'Filter quotes by status',
		displayOptions: {
			show: {
				resource: [ 'quote' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Minimal Quote Information',
		name: 'quoteMinimal',
		type: 'boolean',
		default: true,
		description: 'Because listing returns numerous quotes, listing all quote information for each result can ' +
			'quickly hit the rate limit. By selecting this, only the quote\'s name and ID will be returned.',
		displayOptions: {
			show: {
				resource: [ 'quote' ],
				operation: [ 'list' ],
			},
		},
	},
	// TODO: Add creation date filtering
	// TODO: Add update date filtering
	// TODO: Add sent date filtering
	// TODO: Add sorting
];

// This contains the full list of quote fields
const fullQuoteDetails = `
amounts {
	depositAmount
	discountAmount
	nonTaxAmount
	outstandingDepositAmount
	subtotal
	taxAmount
	total
}
client {
	id
}
clientHubViewedAt
createdAt
depositRecords {
	nodes {
		id
	}
}
id
jobberWebUri
jobs {
	nodes {
		id
	}
}
lineItems {
	nodes {
		id
	}
}
message
noteAttachments {
	nodes {
		id
	}
}
notes {
	nodes
}
previewUrl
property {
	id
}
quoteNumber
request {
	id
}
title
transitionedAt
unallocatedDepositRecords {
	nodes {
		id
	}
}
updatedAt
`;

/**
 * Returns the GraphQL query string for the given quote
 * @param id The ID of the quote
 */
export function QuoteGenerateGetQuery(id: string) {
	return `
		query QuoteQuery {
			quote(id: "${id}") {
				${fullQuoteDetails}
			}
		}
		`;
}

/**
 * Returns the GraphQL query string with the given settings
 * @param qty The number of quotes to return
 * @param search The search term to use
 * @param quoteMinimal Should we only get minimal information?
 * @param quoteClient List only quotes related to client with given ID
 * @param quoteNumber List only quotes with given number
 * @param quoteStatus List only quotes with given status
 */
export function QuoteGenerateListQuery(
	qty: number,
	search: string,
	quoteMinimal: boolean = false,
	quoteClient: string = '',
	quoteNumber: string = '',
	quoteStatus: string = ''
) {
	// Build the arguments for the query
	let args = `first: ${qty}\n`;
	if (search) {
		args += `searchTerm: "${search}"\n`;
	}
	let filterAttributes = '';
	if (quoteClient != '' || quoteNumber != '' || quoteStatus != '') {
		filterAttributes += 'filter: {\n'
		if (quoteClient != '') {
			filterAttributes += `clientId: "${quoteClient}",\n`;
		}
		if (quoteNumber != '') {
			filterAttributes += `quoteNumber: "${quoteNumber}",\n`;
		}
		if (quoteStatus != '') {
			filterAttributes += `status: ${quoteStatus},\n`;
		}
		filterAttributes += '}';
	}
	args += filterAttributes;

	return `
		query QuoteQuery {
			quotes(
				${args}
			) {
				nodes {
					${quoteMinimal ? 'id\ntitle' : fullQuoteDetails}
				}
			}
		}
		`;
}

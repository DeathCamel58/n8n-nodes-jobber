import type {INodeProperties} from 'n8n-workflow';

export const ClientOperations: INodeProperties[] = [
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
				action: 'Get a client by their ID',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List clients',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'client',
				],
			},
		},
	},
];

export const ClientFields: INodeProperties[] = [
	{
		displayName: 'ID',
		name: 'clientID',
		type: 'string',
		default: '',
		description: 'Client ID',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'client' ],
				operation: [ 'get' ],
			},
		},
	},
	{
		displayName: 'Search Term',
		name: 'clientSearch',
		type: 'string',
		default: '',
		description: 'Search term to look for',
		displayOptions: {
			show: {
				resource: [ 'client' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'How many records',
		name: 'clientQty',
		type: 'number',
		default: '10',
		description: 'How many records to return',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'client' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Companies Only',
		name: 'clientFilterCompanies',
		type: 'boolean',
		default: false,
		description: 'Only find companies',
		displayOptions: {
			show: {
				resource: [ 'client' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Leads Only',
		name: 'clientFilterLeads',
		type: 'boolean',
		default: false,
		description: 'Only find leads',
		displayOptions: {
			show: {
				resource: [ 'client' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Archived Only',
		name: 'clientFilterArchived',
		type: 'boolean',
		default: false,
		description: 'Only find archived',
		displayOptions: {
			show: {
				resource: [ 'client' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Minimal Client Information',
		name: 'clientMinimal',
		type: 'boolean',
		default: true,
		description: 'Because listing returns numerous clients, listing all client information for each result can ' +
			'quickly hit the rate limit. By selecting this, only the client\'s name and ID will be returned.',
		displayOptions: {
			show: {
				resource: [ 'client' ],
				operation: [ 'list' ],
			},
		},
	},
	// TODO: Add creation date filtering
	// TODO: Add update date filtering
];

// This contains the full list of client fields
const fullClientDetails = `
balance
billingAddress {
	city
	country
	latitude
	longitude
	postalCode
	province
	street
	street1
	street2
}
clientProperties {
	nodes {
		id
	}
}
companyName
createdAt
defaultEmails
emails {
	address
	description
	id
	primary
}
firstName
id
invoices {
	nodes {
		id
	}
}
isArchivable
isArchived
isCompany
isLead
jobberWebUri
jobs {
	nodes {
		id
	}
}
lastName
name
noteAttachments {
	nodes {
		id
	}
}
notes {
	nodes {
		id
	}
}
phones {
	id
}
quotes {
	nodes {
		id
	}
}
requests {
	nodes {
		id
	}
}
secondaryName
tags {
	nodes {
		id
	}
}
title
updatedAt
`;

/**
 * Returns the GraphQL query string for the given client
 * @param id The ID of the client
 */
export function ClientGenerateGetQuery(id: string) {
	return `
		query ClientQuery {
			client(id: "${id}") {
				${fullClientDetails}
			}
		}
		`;
}

/**
 * Returns the GraphQL query string with the given settings
 * @param qty The number of clients to return
 * @param search The search term to use
 * @param clientMinimal Should we only get minimal information?
 * @param companiesOnly Should we only get companies?
 * @param leadsOnly Should we only get leads?
 * @param archivedOnly Should we only get archived?
 */
export function ClientGenerateListQuery(
	qty: number,
	search: string,
	clientMinimal: boolean = false,
	companiesOnly: boolean = false,
	leadsOnly: boolean = false,
	archivedOnly: boolean = false
) {
	// Build the arguments for the query
	let args = `first: ${qty}\n`;
	if (search) {
		args += `searchTerm: "${search}"\n`;
	}
	let filterAttributes = '';
	if (companiesOnly || leadsOnly || archivedOnly) {
		filterAttributes += 'filter: {\n';
		if (companiesOnly) {
			filterAttributes += `isCompany: ${companiesOnly},\n`;
		}
		if (leadsOnly) {
			filterAttributes += `isLead: ${leadsOnly},\n`;
		}
		if (archivedOnly) {
			filterAttributes += `isLead: ${archivedOnly},\n`;
		}
		filterAttributes += '}';
	}
	args += filterAttributes;

	return `
		query ClientQuery {
			clients(
				${args}
			) {
				nodes {
					${clientMinimal ? 'id\nname' : fullClientDetails}
				}
			}
		}
		`;
}

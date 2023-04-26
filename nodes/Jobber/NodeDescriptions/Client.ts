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
			{
				name: 'Create or Update',
				value: 'upsert',
				/* eslint-disable n8n-nodes-base/node-param-operation-option-action-miscased */
				action: 'Create a new record, or update the current one if it already exists (upsert)',
			},
			{
				name: 'Archive',
				value: 'archive',
				action: 'Archive a client by their ID',
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
				operation: [ 'get', 'archive' ],
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
		displayName: 'How Many Records',
		name: 'clientQty',
		type: 'number',
		default: 10,
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
		description: 'Whether to only find companies',
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
		description: 'Whether to only find leads',
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
		description: 'Whether to only find archived',
		displayOptions: {
			show: {
				resource: [ 'client' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'ID',
		name: 'clientID',
		type: 'string',
		default: '',
		description: 'Client ID',
		displayOptions: {
			show: {
				resource: [ 'client' ],
				operation: [ 'upsert' ],
			},
		},
	},
	{
		displayName: 'First Name',
		name: 'clientFirstName',
		type: 'string',
		default: '',
		description: 'The first name of the client',
		displayOptions: {
			show: {
				resource: [ 'client' ],
				operation: [ 'upsert' ],
			},
		},
	},
	{
		displayName: 'Last Name',
		name: 'clientLastName',
		type: 'string',
		default: '',
		description: 'The last name of the client',
		displayOptions: {
			show: {
				resource: [ 'client' ],
				operation: [ 'upsert' ],
			},
		},
	},
	{
		displayName: 'Company Name',
		name: 'clientCompanyName',
		type: 'string',
		default: '',
		description: 'The company name of the client',
		displayOptions: {
			show: {
				resource: [ 'client' ],
				operation: [ 'upsert' ],
			},
		},
	},
	// TODO: Add support for customFields
	{
		displayName: 'Phones',
		name: 'clientPhones',
		placeholder: 'Add Phones',
		type: 'fixedCollection',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		description: 'The client\'s phone numbers',
		options: [
			{
				name: 'phones',
				displayName: 'Phones',
				values: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the phone number being changed (or nil if a new phone number)',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'The phone type (eg Main, Mobile, etc)',
					},
					{
						displayName: 'Number',
						name: 'number',
						type: 'string',
						default: '',
						description: 'The phone number as stored',
					},
					{
						displayName: 'SMS Allowed',
						name: 'smsAllowed',
						type: 'boolean',
						default: false,
						description: 'Whether the phone number can receive text messages',
					},
					{
						displayName: 'Primary',
						name: 'primary',
						type: 'boolean',
						default: false,
						description: 'Whether this is the primary phone number for this client',
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: [ 'client' ],
				operation: [ 'upsert' ],
			}
		},
	},
	{
		displayName: 'Emails',
		name: 'clientEmails',
		placeholder: 'Add Emails',
		type: 'fixedCollection',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		description: 'The client\'s email addresses',
		options: [
			{
				name: 'emails',
				displayName: 'Emails',
				values: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the email address being changed (or nil if a new email address)',
					},
					{
						displayName: 'Primary',
						name: 'primary',
						type: 'boolean',
						default: false,
						description: 'Whether this is the primary email address',
					},
					{
						displayName: 'Address',
						name: 'address',
						type: 'string',
						default: '',
						description: 'The email address as stored',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'The email address type (eg Main, Work, Personal, Other)',
					},
				],
			},
		],
	},
	{
		displayName: 'Billing Address',
		name: 'clientBillingAddress',
		placeholder: 'Add Billing Address',
		type: 'fixedCollection',
		default: {},
		typeOptions: {
			multipleValues: false,
		},
		description: 'The client\'s billing address',
		options: [
			{
				name: 'billingAddress',
				displayName: 'Billing Address',
				values: [
					{
						displayName: 'Street 1',
						name: 'street1',
						type: 'string',
						default: '',
						description: 'The first line of the street address',
					},
					{
						displayName: 'Street 2',
						name: 'street2',
						type: 'string',
						default: '',
						description: 'The second line of the street address',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
					},
					{
						displayName: 'State or Province',
						name: 'province',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Postal Code',
						name: 'postalCode',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Latitude',
						name: 'latitude',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Longitude',
						name: 'longitude',
						type: 'string',
						default: '',
						description: 'The longitude of this address',
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the property, if it exists',
					},
					// TODO: Support customFields
					{
						displayName: 'Tax Rate ID',
						name: 'taxRateId',
						type: 'string',
						default: '',
						description: 'The tax rate for this property',
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: [ 'client' ],
				operation: [ 'upsert' ],
			}
		},
	},
	{
		displayName: 'Properties',
		name: 'clientProperties',
		placeholder: 'Add Properties',
		type: 'fixedCollection',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		description: 'The client\'s properties',
		options: [
			{
				name: 'properties',
				displayName: 'Properties',
				values: [
					{
						displayName: 'Street 1',
						name: 'street1',
						type: 'string',
						default: '',
						description: 'The first line of the street address',
					},
					{
						displayName: 'Street 2',
						name: 'street2',
						type: 'string',
						default: '',
						description: 'The second line of the street address',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
					},
					{
						displayName: 'State or Province',
						name: 'province',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Postal Code',
						name: 'postalCode',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Latitude',
						name: 'latitude',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Longitude',
						name: 'longitude',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Place ID',
						name: 'placeId',
						type: 'string',
						default: '',
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
					},
					// TODO: Support customFields
					{
						displayName: 'Tax Rate ID',
						name: 'taxRateId',
						type: 'string',
						default: '',
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: [ 'client' ],
				operation: [ 'upsert' ],
			}
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
				operation: [ 'list', 'upsert', 'archive' ],
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
			filterAttributes += `isArchived: ${archivedOnly},\n`;
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

/**
 * Returns the GraphQL query string to upsert a client
 * @param id The number of client to upsert
 * @param firstName The first name of the client
 * @param lastName The last name of the client
 * @param companyName The company name of the client
 * @param phones The client's phone numbers
 * @param emails The client's email addresses
 * @param billingAddress The client's billing address
 * @param properties The client's properties
 * @param minimal Should we only get minimal information?
 */
export function ClientGenerateUpsert(
	id: string = '',
	firstName: string = '',
	lastName: string = '',
	companyName: string = '',
	phones: any,
	emails: any,
	billingAddress: any,
	properties: any,
	minimal: boolean = false
) {
	// Build the arguments for the query
	let args = '';
	if (id) {
		args += `id: "${id}"\n`;
	}
	let attributes = '';
	if (firstName != '' || lastName != '' || companyName != '' || phones != '' || emails != '' || billingAddress != '' || properties != '') {
		attributes += 'attributes: {\n';
		if (firstName != '') {
			attributes += `firstName: "${firstName}",\n`;
		}
		if (lastName != '') {
			attributes += `lastName: "${lastName}",\n`;
		}
		if (companyName != '') {
			attributes += `companyName: "${companyName}",\n`;
		}
		if (Object.keys(phones).length != 0) {
			attributes += `phones: [\n`;
			for (let i = 0; i < phones.phones.length; i++) {
				attributes += '{\n';
				if (phones.phones[i].id != '') {
					attributes += `id: "${phones.phones[i].id}"\n`;
				}
				if (phones.phones[i].description != '') {
					attributes += `description: "${phones.phones[i].description}"\n`;
				}
				if (phones.phones[i].number != '') {
					attributes += `number: "${phones.phones[i].number}"\n`;
				}
				attributes += `smsAllowed: ${phones.phones[i].smsAllowed}\n`;
				attributes += `primary: ${phones.phones[i].primary}\n`;
				attributes += '},\n';
			}
			attributes += `],\n`;
		}
		if (Object.keys(emails).length != 0) {
			attributes += `emails: [\n`;
			for (let i = 0; i < emails.emails.length; i++) {
				attributes += '{\n';
				if (emails.emails[i].id != '') {
					attributes += `id: "${emails.emails[i].id}"\n`;
				}
				attributes += `primary: ${emails.emails[i].primary}\n`;
				if (emails.emails[i].address != '') {
					attributes += `address: "${emails.emails[i].address}"\n`;
				}
				if (emails.emails[i].description != '') {
					attributes += `description: "${emails.emails[i].description}"\n`;
				}
				attributes += '},\n';
			}
			attributes += `],\n`;
		}
		if (Object.keys(billingAddress.billingAddress).length != 0) {
			attributes += 'billingAddress: {\n';
			if (billingAddress.billingAddress.street1 != '') {
				attributes += `street1: "${billingAddress.billingAddress.street1}"\n`;
			}
			if (billingAddress.billingAddress.street2 != '') {
				attributes += `street2: "${billingAddress.billingAddress.street2}"\n`;
			}
			if (billingAddress.billingAddress.city != '') {
				attributes += `city: "${billingAddress.billingAddress.city}"\n`;
			}
			if (billingAddress.billingAddress.country != '') {
				attributes += `country: "${billingAddress.billingAddress.country}"\n`;
			}
			if (billingAddress.billingAddress.province != '') {
				attributes += `province: "${billingAddress.billingAddress.province}"\n`;
			}
			if (billingAddress.billingAddress.postalCode != '') {
				attributes += `postalCode: "${billingAddress.billingAddress.postalCode}"\n`;
			}
			if (billingAddress.billingAddress.latitude != '') {
				attributes += `latitude: ${billingAddress.billingAddress.latitude}\n`;
			}
			if (billingAddress.billingAddress.longitude != '') {
				attributes += `longitude: ${billingAddress.billingAddress.longitude}\n`;
			}
			if (billingAddress.billingAddress.id != '') {
				attributes += `id: "${billingAddress.billingAddress.id}"\n`;
			}
			// TODO: Add customFields
			if (billingAddress.billingAddress.taxRateId != '') {
				attributes += `taxRateId: "${billingAddress.billingAddress.taxRateId}"\n`;
			}
			attributes += '},\n';
		}
		if (Object.keys(properties).length != 0) {
			attributes += `properties: [\n`;
			for (let i = 0; i < properties.properties.length; i++) {
				attributes += '{\n';
				if (properties.properties[i].street1 != '') {
					attributes += `street1: "${properties.properties[i].street1}"\n`;
				}
				if (properties.properties[i].street2 != '') {
					attributes += `street2: "${properties.properties[i].street2}"\n`;
				}
				if (properties.properties[i].city != '') {
					attributes += `city: "${properties.properties[i].city}"\n`;
				}
				if (properties.properties[i].country != '') {
					attributes += `country: "${properties.properties[i].country}"\n`;
				}
				if (properties.properties[i].province != '') {
					attributes += `province: "${properties.properties[i].province}"\n`;
				}
				if (properties.properties[i].postalCode != '') {
					attributes += `postalCode: "${properties.properties[i].postalCode}"\n`;
				}
				if (properties.properties[i].latitude != '') {
					attributes += `latitude: ${properties.properties[i].latitude}\n`;
				}
				if (properties.properties[i].longitude != '') {
					attributes += `longitude: ${properties.properties[i].longitude}\n`;
				}
				if (properties.properties[i].placeId != '') {
					attributes += `placeId: "${properties.properties[i].placeId}"\n`;
				}
				if (properties.properties[i].id != '') {
					attributes += `id: "${properties.properties[i].id}"\n`;
				}
				// TODO: Add customFields
				if (properties.properties[i].taxRateId != '') {
					attributes += `taxRateId: "${properties.properties[i].taxRateId}"\n`;
				}
				attributes += '},\n';
			}
			attributes += `],\n`;
		}
		attributes += '}';
	}
	args += attributes;

	return `
		mutation ClientMutation {
			clientUpsert(
				${args}
			) {
				client {
					${minimal ? 'id\nname' : fullClientDetails}
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
 * Returns the GraphQL query string to archive a client
 * @param id The ID of the client
 * @param minimal Should we only get minimal information?
 */
export function ClientGenerateArchive(
	id: string,
	minimal: boolean = false
) {
	return `
		mutation ClientMutation {
			clientArchive(clientId: "${id}") {
				client {
					${minimal ? 'id\nname' : fullClientDetails}
				}
				userErrors {
					message
					path
				}
			}
		}
		`;
}

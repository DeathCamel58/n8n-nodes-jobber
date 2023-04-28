import type {INodeProperties} from 'n8n-workflow';

export const PropertyOperations: INodeProperties[] = [
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
				action: 'Get a property by its ID',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List properties',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'property',
				],
			},
		},
	},
];

export const PropertyFields: INodeProperties[] = [
	{
		displayName: 'idQueryName',
		name: 'idQueryName',
		type: 'hidden',
		default: 'properties',
		displayOptions: {
			show: {
				resource: [ 'property' ],
			},
		},
	},
	{
		displayName: 'uniqueName',
		name: 'uniqueName',
		type: 'hidden',
		// TODO: Figure out what to set this to
		// The address is in `address { street }`, but we currently can't get this in the list
		default: 'id',
		displayOptions: {
			show: {
				resource: [ 'property' ],
			},
		},
	},
	{
		displayName: 'Property Name or ID',
		name: 'propertyID',
		type: 'options',
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getIds',
		},
		displayOptions: {
			show: {
				resource: [ 'property' ],
				operation: [ 'get' ],
			},
		},
	},
	{
		displayName: 'Search Term',
		name: 'propertySearch',
		type: 'string',
		default: '',
		description: 'Search term to look for',
		displayOptions: {
			show: {
				resource: [ 'property' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'How Many Records',
		name: 'propertyQty',
		type: 'number',
		default: 10,
		description: 'How many records to return',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'property' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Client ID',
		name: 'propertyClient',
		type: 'string',
		default: '',
		description: 'Only return properties for given client ID',
		displayOptions: {
			show: {
				resource: [ 'property' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Minimal Property Information',
		name: 'propertyMinimal',
		type: 'boolean',
		default: true,
		description: 'Because listing returns numerous properties, listing all property information for each result can ' +
			'quickly hit the rate limit. By selecting this, only the property\'s name and ID will be returned.',
		displayOptions: {
			show: {
				resource: [ 'property' ],
				operation: [ 'list' ],
			},
		},
	},
];

// This contains the full list of property fields
const fullPropertyDetails = `
address {
	city
	coordinates {
		latitude
		latitudeString
		longitude
		longitudeString
	}
	country
	geoStatus
	id
	postalCode
	province
	street
	street1
	street2
}
client {
	id
}
id
isBillingAddress
jobberWebUri
jobs {
	nodes {
		id
	}
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
routingOrder
taxRate {
	default
	description
	id
	label
	name
	qboTaxType
	tax
}
`;

/**
 * Returns the GraphQL query string for the given property
 * @param id The ID of the property
 */
export function PropertyGenerateGetQuery(id: string) {
	return `
		query PropertyQuery {
			property(id: "${id}") {
				${fullPropertyDetails}
			}
		}
		`;
}

/**
 * Returns the GraphQL query string with the given settings
 * @param qty The number of properties to return
 * @param search The search term to use
 * @param propertyMinimal Should we only get minimal information?
 * @param propertyClient List only properties related to client with given ID
 */
export function PropertyGenerateListQuery(
	qty: number,
	search: string,
	propertyMinimal: boolean = false,
	propertyClient: string = ''
) {
	// Build the arguments for the query
	let args = `first: ${qty}\n`;
	if (search) {
		args += `searchTerm: "${search}"\n`;
	}
	let filterAttributes = '';
	if (propertyClient != '') {
		filterAttributes += 'filter: {\n'
		if (propertyClient != '') {
			filterAttributes += `clientId: "${propertyClient}",\n`;
		}
		filterAttributes += '}';
	}
	args += filterAttributes;

	return `
		query PropertyQuery {
			properties(
				${args}
			) {
				nodes {
					${propertyMinimal ? 'id\naddress {\nstreet1\n}' : fullPropertyDetails}
				}
			}
		}
		`;
}

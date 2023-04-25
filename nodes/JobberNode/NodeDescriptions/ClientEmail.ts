import type {INodeProperties} from 'n8n-workflow';

export const ClientEmailOperations: INodeProperties[] = [
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
				action: 'Get a client email by its ID',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List client emails',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'clientEmail',
				],
			},
		},
	},
];

export const ClientEmailFields: INodeProperties[] = [
	{
		displayName: 'Search Term',
		name: 'clientEmailSearch',
		type: 'string',
		default: '',
		description: 'Search term to look for',
		displayOptions: {
			show: {
				resource: [ 'clientEmail' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'How many records',
		name: 'clientEmailQty',
		type: 'number',
		default: '10',
		description: 'How many records to return',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'clientEmail' ],
				operation: [ 'list' ],
			},
		},
	},
];

// This contains the full list of clientEmail fields
const fullClientEmailDetails = `
address
client {
	id
}
description
id
primary
`;

/**
 * Returns the GraphQL query string with the given settings
 * @param qty The number of clientEmails to return
 * @param search The search term to use
 */
export function ClientEmailGenerateListQuery(
	qty: number,
	search: string = '',
) {
	// Build the arguments for the query
	let args = `first: ${qty}\n`;
	if (search != '') {
		args += `searchTerm: "${search}"\n`;
	}

	return `
		query ClientEmailQuery {
			clientEmails(
				${args}
			) {
				nodes {
					${fullClientEmailDetails}
				}
			}
		}
		`;
}

import type {INodeProperties} from 'n8n-workflow';

export const TaxRateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'list',
		required: true,
		options: [
			{
				name: 'List',
				value: 'list',
				action: 'List tax rates',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'taxRate',
				],
			},
		},
	},
];

export const TaxRateFields: INodeProperties[] = [
	{
		displayName: 'Search Term',
		name: 'taxRateSearch',
		type: 'string',
		default: '',
		description: 'Search term to look for',
		displayOptions: {
			show: {
				resource: [ 'taxRate' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'How Many Records',
		name: 'taxRateQty',
		type: 'number',
		default: 10,
		description: 'How many records to return',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'taxRate' ],
				operation: [ 'list' ],
			},
		},
	},
];

// This contains the full list of taxRate fields
const fullTaxRateDetails = `
components {
	default
	description
	id
	label
	name
	qboTaxType
	tax
}
default
description
id
label
name
qboTaxType
tax
`;

/**
 * Returns the GraphQL query string with the given settings
 * @param qty The number of taxRates to return
 * @param search The search term to use
 */
export function TaxRateGenerateListQuery(
	qty: number,
	search: string
) {
	// Build the arguments for the query
	let args = `first: ${qty}\n`;
	if (search) {
		args += `searchTerm: "${search}"\n`;
	}

	return `
		query TaxRateQuery {
			taxRates(
				${args}
			) {
				nodes {
					${fullTaxRateDetails}
				}
			}
		}
		`;
}

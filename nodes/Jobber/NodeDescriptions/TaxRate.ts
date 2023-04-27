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
			{
				name: 'Create',
				value: 'create',
				action: 'Create a new tax rate',
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
	{
		displayName: 'Name',
		name: 'taxRateName',
		type: 'string',
		default: '',
		description: 'Tax name',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'taxRate' ],
				operation: [ 'create' ],
			},
		},
	},
	{
		displayName: 'Rate',
		name: 'taxRateRate',
		type: 'string',
		default: '',
		description: 'Tax rate',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'taxRate' ],
				operation: [ 'create' ],
			},
		},
	},
	{
		displayName: 'Internal Description',
		name: 'taxRateInternalDescription',
		type: 'string',
		default: '',
		description: 'Tax internal description',
		displayOptions: {
			show: {
				resource: [ 'taxRate' ],
				operation: [ 'create' ],
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

/**
 * Returns the GraphQL query string to archive a request
 * @param name Tax name
 * @param rate Tax rate
 * @param internalDescription Tax internal description
 * @param minimal Should we only get minimal information?
 */
export function TaxRateGenerateCreate(
	name: string = '',
	rate: string = '0',
	internalDescription: string = '',
	minimal: boolean = false
) {
	// Build the arguments for the query
	let args = '';
	let input = '';
	if (name != '' || rate != '' || internalDescription != '') {
		input += 'input: {\n';
		if (name != '') {
			input += `name: "${name}",\n`;
		}
		if (rate != '') {
			input += `rate: ${rate},\n`;
		}
		if (internalDescription != '') {
			input += `internalDescription: "${internalDescription}",\n`;
		}
		input += '}';
	}
	args += input;

	return `
		mutation TaxRateMutation {
			taxCreate(
				${args}
			) {
				tax {
					${minimal ? 'id\nname' : '\ndefault\ndescription\nid\nlabel\nname\nqboTaxType\ntax'}
				}
				userErrors {
					message
					path
				}
			}
		}
		`;
}

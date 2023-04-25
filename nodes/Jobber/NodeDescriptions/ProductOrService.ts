import type {INodeProperties} from 'n8n-workflow';

export const ProductOrServiceOperations: INodeProperties[] = [
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
				action: 'Get a product or service by its ID',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List products or services',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'productOrService',
				],
			},
		},
	},
];

export const ProductOrServiceFields: INodeProperties[] = [
	{
		displayName: 'ID',
		name: 'productOrServiceID',
		type: 'string',
		default: '',
		description: 'Product or service ID',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'productOrService' ],
				operation: [ 'get' ],
			},
		},
	},
	{
		displayName: 'How Many Records',
		name: 'productOrServiceQty',
		type: 'number',
		default: 10,
		description: 'How many records to return',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'productOrService' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Minimal ProductOrService Information',
		name: 'productOrServiceMinimal',
		type: 'boolean',
		default: true,
		description: 'Because listing returns numerous products or services, listing all products or service information for each result can ' +
			'quickly hit the rate limit. By selecting this, only the product\'s or service\'s name and ID will be returned.',
		displayOptions: {
			show: {
				resource: [ 'productOrService' ],
				operation: [ 'list' ],
			},
		},
	},
];

// This contains the full list of productOrService fields
const fullProductOrServiceDetails = `
category
defaultUnitCost
description
durationMinutes
id
internalUnitCost
markup
name
onlineBookingEnabled
onlineBookingSortOrder
taxable
visible
`;

/**
 * Returns the GraphQL query string for the given product or service
 * @param id The ID of the product or service
 */
export function ProductOrServiceGenerateGetQuery(id: string) {
	return `
		query ProductOrServiceQuery {
			productOrService(id: "${id}") {
				${fullProductOrServiceDetails}
			}
		}
		`;
}

/**
 * Returns the GraphQL query string with the given settings
 * @param qty The number of product or services to return
 * @param productOrServiceMinimal Should we only get minimal information?
 */
export function ProductOrServiceGenerateListQuery(
	qty: number,
	productOrServiceMinimal: boolean = false,
) {
	// Build the arguments for the query
	let args = `first: ${qty}\n`;

	return `
		query ProductOrServiceQuery {
			productOrServices(
				${args}
			) {
				nodes {
					${productOrServiceMinimal ? 'id\nname' : fullProductOrServiceDetails}
				}
			}
		}
		`;
}

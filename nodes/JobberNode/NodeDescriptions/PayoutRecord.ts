import type {INodeProperties} from 'n8n-workflow';

export const PayoutRecordOperations: INodeProperties[] = [
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
				action: 'Get a payout record by its ID',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List payout records',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'payoutRecord',
				],
			},
		},
	},
];

export const PayoutRecordFields: INodeProperties[] = [
	{
		displayName: 'ID',
		name: 'payoutRecordID',
		type: 'string',
		default: '',
		description: 'payoutRecord ID',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'payoutRecord' ],
				operation: [ 'get' ],
			},
		},
	},
	{
		displayName: 'How many records',
		name: 'payoutRecordQty',
		type: 'number',
		default: '10',
		description: 'How many records to return',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'payoutRecord' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Minimal Payout Record Information',
		name: 'payoutRecordMinimal',
		type: 'boolean',
		default: true,
		description: 'Because listing returns numerous payoutRecords, listing all payoutRecord information for each result can ' +
			'quickly hit the rate limit. By selecting this, only the payoutRecord\'s name and ID will be returned.',
		displayOptions: {
			show: {
				resource: [ 'payoutRecord' ],
				operation: [ 'list' ],
			},
		},
	},
];

// This contains the full list of payoutRecord fields
const fullPayoutRecordDetails = `
arrivalDate
balanceTransactions {
	nodes {
		id
	}
}
created
currency
feeAmount
grossAmount
id
identifier
netAmount
payoutMethod
status
type
`;

/**
 * Returns the GraphQL query string for the given payout record
 * @param id The ID of the payoutRecord
 */
export function PayoutRecordGenerateGetQuery(id: string) {
	return `
		query PayoutRecordQuery {
			payoutRecord(id: "${id}") {
				${fullPayoutRecordDetails}
			}
		}
		`;
}

/**
 * Returns the GraphQL query string with the given settings
 * @param qty The number of payout records to return
 * @param payoutRecordMinimal Should we only get minimal information?
 */
export function PayoutRecordGenerateListQuery(
	qty: number,
	payoutRecordMinimal: boolean = false,
) {
	// Build the arguments for the query
	let args = `first: ${qty}\n`;

	return `
		query PayoutRecordQuery {
			payoutRecords(
				${args}
			) {
				nodes {
					${payoutRecordMinimal ? 'id\ncreated' : fullPayoutRecordDetails}
				}
			}
		}
		`;
}

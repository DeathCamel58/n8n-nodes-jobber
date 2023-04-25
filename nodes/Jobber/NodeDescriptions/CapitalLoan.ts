import type {INodeProperties} from 'n8n-workflow';

export const CapitalLoanOperations: INodeProperties[] = [
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
				action: 'List capital loans',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'capitalLoan',
				],
			},
		},
	},
];

export const CapitalLoanFields: INodeProperties[] = [
	{
		displayName: 'ID',
		name: 'capitalLoanID',
		type: 'string',
		default: '',
		description: 'CapitalLoan ID',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'capitalLoan' ],
				operation: [ 'get' ],
			},
		},
	},
	{
		displayName: 'How Many Records',
		name: 'capitalLoanQty',
		type: 'number',
		default: 10,
		description: 'How many records to return',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'capitalLoan' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Capital Loan Status',
		name: 'capitalLoanStatus',
		type: 'options',
		options: [
			{
				name: 'Accepted',
				value: 'ACCEPTED',
			},
			{
				name: 'Cancelled',
				value: 'CANCELLED',
			},
			{
				name: 'Delivered',
				value: 'DELIVERED',
			},
			{
				name: 'Expired',
				value: 'EXPIRED',
			},
			{
				name: 'Fully Repaid',
				value: 'FULLY_REPAID',
			},
			{
				name: 'No Filter',
				value: '',
			},
			{
				name: 'Paid Out',
				value: 'PAID_OUT',
			},
			{
				name: 'Undelivered',
				value: 'UNDELIVERED',
			},
		],
		default: '',
		description: 'Only show capital loans with given status',
		displayOptions: {
			show: {
				resource: [ 'capitalLoan' ],
				operation: [ 'list' ],
			},
		},
	},
	// TODO: Add creation date filtering
];

// This contains the full list of capitalLoan fields
const fullCapitalLoanDetails = `
createdAt
id
loanFeeAmount
status
updatedAt
`;

/**
 * Returns the GraphQL query string with the given settings
 * @param qty The number of capitalLoans to return
 * @param capitalLoanStatus What capital loan status to filter by
 */
export function CapitalLoanGenerateListQuery(
	qty: number,
	capitalLoanStatus: string = ''
) {
	// Build the arguments for the query
	let args = `first: ${qty}\n`;
	let filterAttributes = '';
	if (capitalLoanStatus != '') {
		filterAttributes += 'filter: {\n';
		if (capitalLoanStatus != '') {
			filterAttributes += `status: ${capitalLoanStatus},\n`;
		}
		filterAttributes += '}';
	}
	args += filterAttributes;

	return `
		query CapitalLoanQuery {
			capitalLoans(
				${args}
			) {
				nodes {
					${fullCapitalLoanDetails}
				}
			}
		}
		`;
}

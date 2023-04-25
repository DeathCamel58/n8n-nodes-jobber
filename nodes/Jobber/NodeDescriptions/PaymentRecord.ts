import type {INodeProperties} from 'n8n-workflow';

export const PaymentRecordOperations: INodeProperties[] = [
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
				action: 'Get a payment record by its ID',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List payment records',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'paymentRecord',
				],
			},
		},
	},
];

export const PaymentRecordFields: INodeProperties[] = [
	{
		displayName: 'ID',
		name: 'paymentRecordID',
		type: 'string',
		default: '',
		description: 'Payment Record ID',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'paymentRecord' ],
				operation: [ 'get' ],
			},
		},
	},
	{
		displayName: 'How Many Records',
		name: 'paymentRecordQty',
		type: 'number',
		default: 10,
		description: 'How many records to return',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'paymentRecord' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Adjustment Type',
		name: 'paymentRecordAdjustmentType',
		type: 'options',
		options: [
			{
				name: 'Bad Debt',
				value: 'BAD_DEBT',
			},
			{
				name: 'Correction',
				value: 'CORRECTION',
			},
			{
				name: 'Deposit',
				value: 'DEPOSIT',
			},
			{
				name: 'Failed ACH Payment',
				value: 'FAILED_ACH_PAYMENT',
			},
			{
				name: 'Initial Balance',
				value: 'INITIAL_BALANCE',
			},
			{
				name: 'Invoice',
				value: 'INVOICE',
			},
			{
				name: 'No Filter',
				value: '',
			},
			{
				name: 'Payment',
				value: 'PAYMENT',
			},
			{
				name: 'Refund',
				value: 'REFUND',
			},
		],
		default: '',
		description: 'Filter payment records by adjustment type',
		displayOptions: {
			show: {
				resource: [ 'paymentRecord' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Payment Type',
		name: 'paymentRecordType',
		type: 'options',
		options: [
			{
				name: 'Bank Transfer',
				value: 'BANK_TRANSFER',
			},
			{
				name: 'Cash',
				value: 'CASH',
			},
			{
				name: 'Cheque',
				value: 'CHEQUE',
			},
			{
				name: 'Credit Card',
				value: 'CREDIT_CARD',
			},
			{
				name: 'Customer Financing',
				value: 'CONSUMER_FINANCING',
			},
			{
				name: 'E-Payment',
				value: 'EPAYMENT',
			},
			{
				name: 'Jobber Payments',
				value: 'JOBBER_PAYMENTS',
			},
			{
				name: 'Money Order',
				value: 'MONEY_ORDER',
			},
			{
				name: 'No Filter',
				value: '',
			},
			{
				name: 'Other',
				value: 'OTHER',
			},
		],
		default: '',
		description: 'Filter payment records by payment type',
		displayOptions: {
			show: {
				resource: [ 'paymentRecord' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Minimal PaymentRecord Information',
		name: 'paymentRecordMinimal',
		type: 'boolean',
		default: true,
		description: 'Because listing returns numerous paymentRecords, listing all paymentRecord information for each result can ' +
			'quickly hit the rate limit. By selecting this, only the paymentRecord\'s name and ID will be returned.',
		displayOptions: {
			show: {
				resource: [ 'paymentRecord' ],
				operation: [ 'list' ],
			},
		},
	},
	// TODO: Add entry date filtering
];

// This contains the full list of paymentRecord fields
const fullPaymentRecordDetails = `
adjustmentType
amount
client {
	id
}
details
entryDate
id
invoice {
	id
}
paymentOrigin
paymentType
quote {
	id
}
sentAt
`;

/**
 * Returns the GraphQL query string for the given payment record
 * @param id The ID of the paymentRecord
 */
export function PaymentRecordGenerateGetQuery(id: string) {
	return `
		query PaymentRecordQuery {
			paymentRecord(id: "${id}") {
				${fullPaymentRecordDetails}
			}
		}
		`;
}

/**
 * Returns the GraphQL query string with the given settings
 * @param qty The number of payment records to return
 * @param paymentRecordMinimal Should we only get minimal information?
 * @param paymentRecordAdjustmentType List only payment records with a given adjustment type
 * @param paymentRecordType List only payment records of type
 */
export function PaymentRecordGenerateListQuery(
	qty: number,
	paymentRecordMinimal: boolean = false,
	paymentRecordAdjustmentType: string = '',
	paymentRecordType: string = ''
) {
	// Build the arguments for the query
	let args = `first: ${qty}\n`;
	let filterAttributes = '';
	if (paymentRecordAdjustmentType != '' || paymentRecordType != '') {
		filterAttributes += 'filter: {\n'
		if (paymentRecordAdjustmentType != '') {
			filterAttributes += `adjustmentType: ${paymentRecordAdjustmentType},\n`;
		}
		if (paymentRecordType != '') {
			filterAttributes += `paymentType: ${paymentRecordType},\n`;
		}
		filterAttributes += '}';
	}
	args += filterAttributes;

	return `
		query PaymentRecordQuery {
			paymentRecords(
				${args}
			) {
				nodes {
					${paymentRecordMinimal ? 'id\nentryDate' : fullPaymentRecordDetails}
				}
			}
		}
		`;
}

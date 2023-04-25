import type {INodeProperties} from 'n8n-workflow';

export const InvoiceOperations: INodeProperties[] = [
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
				action: 'Get an invoice by its ID',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List invoices',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'invoice',
				],
			},
		},
	},
];

export const InvoiceFields: INodeProperties[] = [
	{
		displayName: 'ID',
		name: 'invoiceID',
		type: 'string',
		default: '',
		description: 'invoice ID',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'invoice' ],
				operation: [ 'get' ],
			},
		},
	},
	{
		displayName: 'Search Term',
		name: 'invoiceSearch',
		type: 'string',
		default: '',
		description: 'Search term to look for',
		displayOptions: {
			show: {
				resource: [ 'invoice' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'How many records',
		name: 'invoiceQty',
		type: 'number',
		default: '10',
		description: 'How many records to return',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'invoice' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Invoice ID',
		name: 'invoiceFilterClient',
		type: 'string',
		default: '',
		description: 'Only find invoices linked to given invoice ID',
		displayOptions: {
			show: {
				resource: [ 'invoice' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Invoice Number',
		name: 'invoiceFilterNumber',
		type: 'string',
		default: '',
		description: 'Only find invoices with number',
		displayOptions: {
			show: {
				resource: [ 'invoice' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Minimal Invoice Information',
		name: 'invoiceMinimal',
		type: 'boolean',
		default: true,
		description: 'Because listing returns numerous invoices, listing all invoice information for each result can ' +
			'quickly hit the rate limit. By selecting this, only the invoice\'s name and ID will be returned.',
		displayOptions: {
			show: {
				resource: [ 'invoice' ],
				operation: [ 'list' ],
			},
		},
	},
	// TODO: Add filtering by total
	// TODO: Add filtering by status
	// TODO: Add creation date filtering
	// TODO: Add update date filtering
	// TODO: Add due date filtering
	// TODO: Add issue date filtering
	// TODO: Add sorting
];

// This contains the full list of invoice fields
const fullInvoiceDetails = `
amounts {
	depositAmount
	discountAmount
	invoiceBalance
	nonTaxAmount
	paymentsTotal
	subtotal
	taxAmount
	tipsTotal
	total
}
billingAddress {
	city
	country
	coordinates {
		latitude
		longitude
	}
	geoStatus
	postalCode
	province
	street
	street1
	street2
}
billingIsSameAsPropertyAddress
client {
	id
}
createdAt
dateViewedInClientHub
dueDate
id
invoiceNet
invoiceNumber
invoiceStatus
issuedDate
jobberWebUri
jobs {
	nodes {
		id
	}
}
lineItems {
	nodes {
		id
		name
		description
	}
}
linkedCommunications {
	totalCount
}
message
noteAttachments {
	nodes {
		id
	}
}
paymentRecords {
	nodes {
		adjustmentType
		amount
		entryDate
		id
		jobberPaymentTransactionStatus
		tipAmount
	}
}
properties {
	nodes {
		id
	}
}
receivedDate
subject
taxCalculationMethod
taxRate {
	default
	description
	id
	label
	name
	qboTaxType
	tax
}
updatedAt
visits {
	nodes {
		id
	}
}
`;

/**
 * Returns the GraphQL query string for the given invoice
 * @param id The ID of the invoice
 */
export function InvoiceGenerateGetQuery(id: string) {
	return `
		query InvoiceQuery {
			invoice(id: "${id}") {
				${fullInvoiceDetails}
			}
		}
		`;
}

/**
 * Returns the GraphQL query string with the given settings
 * @param qty The number of invoices to return
 * @param search The search term to use
 * @param invoiceMinimal Should we only get minimal information?
 * @param invoiceId The invoice ID to search for
 * @param invoiceClient The client to find invoices for
 * @param invoiceNumber The invoice number to search for
 */
export function InvoiceGenerateListQuery(
	qty: number,
	search: string,
	invoiceMinimal: boolean = false,
	invoiceId: string = '',
	invoiceClient: string = '',
	invoiceNumber: string = ''
) {
	// Build the arguments for the query
	let args = `first: ${qty}\n`;
	if (search) {
		args += `searchTerm: "${search}"\n`;
	}
	let filterAttributes = '';
	if (invoiceId != '' || invoiceNumber != '' || invoiceClient != '') {
		filterAttributes += 'filter: {\n';
		if (invoiceId != '') {
			filterAttributes += `invoiceId: "${invoiceId}",\n`;
		}
		if (invoiceNumber != '') {
			filterAttributes += `invoiceNumber: "${invoiceNumber}",\n`;
		}
		if (invoiceClient != '') {
			filterAttributes += `clientId: "${invoiceClient}",\n`;
		}
		filterAttributes += '}';
	}
	args += filterAttributes;

	return `
		query InvoiceQuery {
			invoices(
				${args}
			) {
				nodes {
					${invoiceMinimal ? 'id\nsubject' : fullInvoiceDetails}
				}
			}
		}
		`;
}

import type {INodeProperties} from 'n8n-workflow';

export const VisitOperations: INodeProperties[] = [
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
				action: 'Get a visit by its ID',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List visits',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'visit',
				],
			},
		},
	},
];

export const VisitFields: INodeProperties[] = [
	{
		displayName: 'ID',
		name: 'visitID',
		type: 'string',
		default: '',
		description: 'Bisit ID',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'visit' ],
				operation: [ 'get' ],
			},
		},
	},
	{
		displayName: 'How Many Records',
		name: 'visitQty',
		type: 'number',
		default: 10,
		description: 'How many records to return',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'visit' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Status Filter',
		name: 'visitStatus',
		type: 'options',
		options: [
			{
				name: 'Active',
				value: 'ACTIVE',
			},
			{
				name: 'Completed',
				value: 'COMPLETED',
			},
			{
				name: 'Late',
				value: 'LATE',
			},
			{
				name: 'No Filter',
				value: '',
			},
			{
				name: 'Today',
				value: 'TODAY',
			},
			{
				name: 'Unscheduled',
				value: 'UNSCHEDULED',
			},
			{
				name: 'Upcoming',
				value: 'UPCOMING',
			},
		],
		default: '',
		description: 'Filter visits by status',
		displayOptions: {
			show: {
				resource: [ 'visit' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Invoice Status Filter',
		name: 'visitInvoiceStatus',
		type: 'options',
		options: [
			{
				name: 'No Filter',
				value: '',
			},
			{
				name: 'Invoiced Only',
				value: 'INVOICED_ONLY',
			},
			{
				name: 'Uninvoiced Only',
				value: 'UNINVOICED_ONLY',
			},
		],
		default: '',
		description: 'Filter visits by invoice status',
		displayOptions: {
			show: {
				resource: [ 'visit' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Billing Period Filter',
		name: 'onlyRelevantToBillingPeriod',
		type: 'options',
		options: [
			{
				name: 'No Filter',
				value: '',
			},
			{
				name: 'Yes',
				value: 'true',
			},
			{
				name: 'No',
				value: 'false',
			},
		],
		default: '',
		description: 'Filter for: Only shows most relevant visits to the billing period for jobs with visit based billing',
		displayOptions: {
			show: {
				resource: [ 'visit' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Assigned To',
		name: 'visitAssignedTo',
		type: 'string',
		default: '',
		description: 'Filter to only show visits assigned to user ID',
		displayOptions: {
			show: {
				resource: [ 'visit' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Product or Service ID',
		name: 'visitProductID',
		type: 'string',
		default: '',
		description: 'Filter to only show visits that contain a product or service ID',
		displayOptions: {
			show: {
				resource: [ 'visit' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Minimal Visit Information',
		name: 'visitMinimal',
		type: 'boolean',
		default: true,
		description: 'Because listing returns numerous visits, listing all visit information for each result can ' +
			'quickly hit the rate limit. By selecting this, only the visit\'s name and ID will be returned.',
		displayOptions: {
			show: {
				resource: [ 'visit' ],
				operation: [ 'list' ],
			},
		},
	},
	// TODO: Add creation date filtering
	// TODO: Add start date filtering
	// TODO: Add end date filtering
	// TODO: Add completed date filtering
	// TODO: Add sorting
];

// This contains the full list of visit fields
const fullVisitDetails = `
actionsUponComplete
allDay
arrivalWindow {
	id
}
assignedUsers {
	nodes {
		id
	}
}
client {
	id
}
completedAt
createdAt
createdBy {
	id
}
duration
endAt
id
instructions
invoice {
	id
}
isComplete
isDefaultTitle
isLastScheduledVisit
job {
	id
}
lineItems {
	nodes {
		id
	}
}
notes {
	nodes
}
overrideOrder
property {
	id
}
startAt
title
visitStatus
`;

/**
 * Returns the GraphQL query string for the given visit
 * @param id The ID of the visit
 */
export function VisitGenerateGetQuery(id: string) {
	return `
		query VisitQuery {
			visit(id: "${id}") {
				${fullVisitDetails}
			}
		}
		`;
}

/**
 * Returns the GraphQL query string with the given settings
 * @param qty The number of visits to return
 * @param visitMinimal Should we only get minimal information?
 * @param status Filters by visit status
 * @param invoiceStatus OThe invoice status filter by
 * @param relevantToBillingPeriod Only shows most relevant visits to the billing period for jobs with visit based billing
 * @param assignedTo The assigned user id to filter by
 * @param productOrServiceId The line item associated with a specific product or service to filter by
 */
export function VisitGenerateListQuery(
	qty: number,
	visitMinimal: boolean = false,
	status: string = '',
	invoiceStatus: string = '',
	relevantToBillingPeriod: string = '',
	assignedTo: string = '',
	productOrServiceId: string = ''
) {
	// Build the arguments for the query
	let args = `first: ${qty}\n`;
	let filterAttributes = '';
	if (status != '' || invoiceStatus != '' || relevantToBillingPeriod != '' || assignedTo != '' || productOrServiceId != '') {
		filterAttributes += 'filter: {\n';
		if (status != '') {
			filterAttributes += `status: ${status},\n`;
		}
		if (invoiceStatus != '') {
			filterAttributes += `invoiceStatus: ${invoiceStatus},\n`;
		}
		if (relevantToBillingPeriod != '') {
			filterAttributes += `onlyRelevantToBillingPeriod: ${relevantToBillingPeriod},\n`;
		}
		if (assignedTo != '') {
			filterAttributes += `assignedTo: "${assignedTo}",\n`;
		}
		if (productOrServiceId != '') {
			filterAttributes += `productOrServiceId: "${productOrServiceId}",\n`;
		}
		filterAttributes += '}';
	}
	args += filterAttributes;

	return `
		query VisitQuery {
			visits(
				${args}
			) {
				nodes {
					${visitMinimal ? 'id\ntitle' : fullVisitDetails}
				}
			}
		}
		`;
}

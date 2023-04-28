import type {INodeProperties} from 'n8n-workflow';

export const JobOperations: INodeProperties[] = [
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
				action: 'Get a job by its ID',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List jobs',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'job',
				],
			},
		},
	},
];

export const JobFields: INodeProperties[] = [
	{
		displayName: 'idQueryName',
		name: 'idQueryName',
		type: 'hidden',
		default: 'jobs',
		displayOptions: {
			show: {
				resource: [ 'job' ],
			},
		},
	},
	{
		displayName: 'uniqueName',
		name: 'uniqueName',
		type: 'hidden',
		default: 'jobNumber',
		displayOptions: {
			show: {
				resource: [ 'job' ],
			},
		},
	},
	{
		displayName: 'Job Name or ID',
		name: 'jobID',
		type: 'options',
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getIds',
		},
		displayOptions: {
			show: {
				resource: [ 'job' ],
				operation: [ 'get' ],
			},
		},
	},
	{
		displayName: 'Search Term',
		name: 'jobSearch',
		type: 'string',
		default: '',
		description: 'Search term to look for',
		displayOptions: {
			show: {
				resource: [ 'job' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'How Many Records',
		name: 'jobQty',
		type: 'number',
		default: 10,
		description: 'How many records to return',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'job' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Include Unscheduled',
		name: 'jobFilterUnscheduled',
		type: 'boolean',
		default: true,
		description: 'Whether to include unscheduled jobs',
		displayOptions: {
			show: {
				resource: [ 'job' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Status Filter',
		name: 'jobStatus',
		type: 'options',
		options: [
			{
				name: 'Action Required',
				value: 'action_required',
			},
			{
				name: 'Active',
				value: 'active',
			},
			{
				name: 'Archived',
				value: 'archived',
			},
			{
				name: 'Late',
				value: 'late',
			},
			{
				name: 'No Filter',
				value: '',
			},
			{
				name: 'On Hold',
				value: 'on_hold',
			},
			{
				name: 'Requires Invoicing',
				value: 'requires_invoicing',
			},
			{
				name: 'Today',
				value: 'today',
			},
			{
				name: 'Unscheduled',
				value: 'unscheduled',
			},
			{
				name: 'Upcoming',
				value: 'upcoming',
			},
		],
		default: '',
		description: 'Filter jobs by status',
		displayOptions: {
			show: {
				resource: [ 'job' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Job Type Filter',
		name: 'jobType',
		type: 'options',
		options: [
			{
				name: 'No Filter',
				value: '',
			},
			{
				name: 'One Off',
				value: 'ONE_OFF',
			},
			{
				name: 'Recurring',
				value: 'RECURRING',
			},
		],
		default: '',
		description: 'Filter based on job\'s status',
		displayOptions: {
			show: {
				resource: [ 'job' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Minimal Job Information',
		name: 'jobMinimal',
		type: 'boolean',
		default: true,
		description: 'Because listing returns numerous jobs, listing all job information for each result can ' +
			'quickly hit the rate limit. By selecting this, only the job\'s name and ID will be returned.',
		displayOptions: {
			show: {
				resource: [ 'job' ],
				operation: [ 'list' ],
			},
		},
	},
	// TODO: Add creation date filtering
	// TODO: Add start date filtering
	// TODO: Add end date filtering
	// TODO: Add completion date filtering
	// TODO: Add sorting
];

// This contains the full list of job fields
const fullJobDetails = `
arrivalWindow {
	centeredOnStartTime
	duration
	endAt
	id
	startAt
}
billingType
bookingConfirmationSentAt
client {
	id
}
completedAt
createdAt
defaultVisitTitle
endAt
expenses {
	nodes {
		id
	}
}
id
instructions
invoiceSchedule {
	billingFrequency
	recurrenceSchedule {
		calendarRule
		friendly
	}
	scheduleSummary
}
invoices {
	nodes {
		id
	}
}
jobNumber
jobStatus
jobType
jobberWebUri
lineItems {
	nodes {
		id
	}
}
noteAttachments {
	nodes {
		id
	}
}
notes {
	nodes
}
paymentRecords {
	nodes {
		id
	}
}
property {
	id
}
quote {
	id
}
startAt
timeSheetEntries {
	nodes {
		id
	}
}
title
total
updatedAt
visitSchedule {
	endDate
	endTime
	startDate
	startTime
}
visits {
	nodes {
		id
	}
}
visitsInfo {
	futureCount
	incompleteTotal
	pastCount
	scheduledCount
	unscheduledCount
}
willClientBeAutomaticallyCharged
`;

/**
 * Returns the GraphQL query string for the given job
 * @param id The ID of the job
 */
export function JobGenerateGetQuery(id: string) {
	return `
		query JobQuery {
			job(id: "${id}") {
				${fullJobDetails}
			}
		}
		`;
}

/**
 * Returns the GraphQL query string with the given settings
 * @param qty The number of jobs to return
 * @param search The search term to use
 * @param jobMinimal Should we only get minimal information?
 * @param jobUnscheduled Should we include unscheduled jobs?
 * @param jobStatus The status of the job to filter by
 * @param jobType The job type to filter by
 */
export function JobGenerateListQuery(
	qty: number,
	search: string,
	jobMinimal: boolean = false,
	jobUnscheduled: boolean = true,
	jobStatus: string = '',
	jobType: string = ''
) {
	// Build the arguments for the query
	let args = `first: ${qty}\n`;
	if (search) {
		args += `searchTerm: "${search}"\n`;
	}
	let filterAttributes = '';
	if (jobUnscheduled || jobStatus != '' || jobType != '') {
		filterAttributes = 'filter: {\n';
		if (jobStatus != '') {
			filterAttributes += `status: ${jobStatus},\n`;
		}
		if (jobType != '') {
			filterAttributes += `jobType: ${jobType},\n`;
		}
		if (jobUnscheduled) {
			filterAttributes += `includeUnscheduled: ${jobUnscheduled},\n`;
		}
		// TODO: Filtering by status doesn't work
		filterAttributes += '}';
		args += filterAttributes;
	}

	return `
		query JobQuery {
			jobs(
				${args}
			) {
				nodes {
					${jobMinimal ? 'id\ntitle' : fullJobDetails}
				}
			}
		}
		`;
}

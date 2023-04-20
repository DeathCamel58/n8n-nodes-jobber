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
		displayName: 'ID',
		name: 'jobID',
		type: 'string',
		default: '',
		description: 'job ID',
		required: true,
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
		displayName: 'How many records',
		name: 'jobQty',
		type: 'number',
		default: '10',
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
		displayName: 'Include unscheduled',
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
	// TODO: Add filtering by type
	// TODO: Add creation date filtering
	// TODO: Add start date filtering
	// TODO: Add end date filtering
	// TODO: Add completion date filtering
	// TODO: Add status filtering
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
 */
export function JobGenerateListQuery(
	qty: number,
	search: string,
	jobMinimal: boolean = false,
	jobUnscheduled: boolean = true
) {
	// Build the arguments for the query
	let args = `first: ${qty}\n`;
	if (search) {
		args += `searchTerm: "${search}"\n`;
	}
	let filterAttributes = 'filter: {\n';
	if (jobUnscheduled) {
		filterAttributes += `includeUnscheduled: ${jobUnscheduled},\n`;
	}
	filterAttributes += '}';
	args += filterAttributes;

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

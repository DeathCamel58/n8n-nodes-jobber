import type {INodeProperties} from 'n8n-workflow';

export const TaskOperations: INodeProperties[] = [
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
				action: 'Get a task by its ID',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'task',
				],
			},
		},
	},
];

export const TaskFields: INodeProperties[] = [
	{
		displayName: 'ID',
		name: 'taskID',
		type: 'string',
		default: '',
		description: 'Task ID',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'task' ],
				operation: [ 'get' ],
			},
		},
	},
];

// This contains the full list of task fields
const fullTaskDetails = `
allDay
assignedUsers {
	nodes {
		id
	}
}
client {
	id
}
createdBy {
	id
}
duration
endAt
id
instructions
isComplete
isDefaultTitle
isRecurring
overrideOrder
property {
	id
}
recurrenceSchedule {
	calendarRule
	friendly
}
startAt
title
`;

/**
 * Returns the GraphQL query string for the given task
 * @param id The ID of the task
 */
export function TaskGenerateGetQuery(id: string) {
	return `
		query TaskQuery {
			task(id: "${id}") {
				${fullTaskDetails}
			}
		}
		`;
}

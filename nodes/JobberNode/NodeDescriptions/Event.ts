import type {INodeProperties} from 'n8n-workflow';

export const EventOperations: INodeProperties[] = [
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
				action: 'Get an event by its ID',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'event',
				],
			},
		},
	},
];

export const EventFields: INodeProperties[] = [
	{
		displayName: 'ID',
		name: 'eventID',
		type: 'string',
		default: '',
		description: 'event ID',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'event' ],
				operation: [ 'get' ],
			},
		},
	},
];

// This contains the full list of event fields
const fullEventDetails = `
allDay
assignedUsers {
	nodes {
		id
	}
}
createdBy {
	id
}
description
duration
endAt
id
isComplete
isDefaultTitle
overrideOrder
recurringSummary
startAt
title
`;

/**
 * Returns the GraphQL query string for the given event
 * @param id The ID of the event
 */
export function EventGenerateGetQuery(id: string) {
	return `
		query EventQuery {
			event(id: "${id}") {
				${fullEventDetails}
			}
		}
		`;
}

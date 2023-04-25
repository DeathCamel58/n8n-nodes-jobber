import type {INodeProperties} from 'n8n-workflow';

export const AssessmentOperations: INodeProperties[] = [
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
				action: 'Get an assessment by its ID',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'assessment',
				],
			},
		},
	},
];

export const AssessmentFields: INodeProperties[] = [
	{
		displayName: 'ID',
		name: 'assessmentID',
		type: 'string',
		default: '',
		description: 'Assessment ID',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'assessment' ],
				operation: [ 'get' ],
			},
		},
	},
];

// This contains the full list of assessment fields
const fullAssessmentDetails = `
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
overrideOrder
property {
	id
}
request {
	id
}
startAt
title
`;

/**
 * Returns the GraphQL query string for the given assessment
 * @param id The ID of the assessment
 */
export function AssessmentGenerateGetQuery(id: string) {
	return `
		query AssessmentQuery {
			assessment(id: "${id}") {
				${fullAssessmentDetails}
			}
		}
		`;
}

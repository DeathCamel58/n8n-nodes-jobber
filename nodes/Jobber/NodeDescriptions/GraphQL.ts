import type { INodeProperties } from 'n8n-workflow';

export const GraphQLOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'send',
		required: true,
		options: [
			{
				name: 'Send',
				value: 'send',
				/* eslint-disable n8n-nodes-base/node-param-operation-option-action-miscased */
				action: 'Send raw GraphQL request',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'graphql',
				],
			},
		},
	},
];

export const GraphQLFields: INodeProperties[] = [
	{
		displayName: 'Query',
		name: 'query',
		type: 'json',
		default: '',
		description: 'GraphQL query',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'graphql',
				],
			},
		},
	},
	{
		displayName: 'Variables',
		name: 'variables',
		type: 'json',
		default: '',
		description: 'Query variables',
		displayOptions: {
			show: {
				resource: [
					'graphql',
				],
			},
		},
	},
];

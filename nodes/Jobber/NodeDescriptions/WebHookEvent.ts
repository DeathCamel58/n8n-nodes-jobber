import type {INodeProperties} from 'n8n-workflow';

export const WebHookEventOperations: INodeProperties[] = [
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
				action: 'Get a webhook event by its ID',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'webHookEvent',
				],
			},
		},
	},
];

export const WebHookEventFields: INodeProperties[] = [
	{
		displayName: 'Account ID',
		name: 'webHookEventAccountId',
		type: 'string',
		default: '',
		description: 'WebHook Event Account ID',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'webHookEvent' ],
				operation: [ 'get' ],
			},
		},
	},
	{
		displayName: 'Item ID',
		name: 'webHookEventItemId',
		type: 'string',
		default: '',
		description: 'WebHook Event Item ID',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'webHookEvent' ],
				operation: [ 'get' ],
			},
		},
	},
	{
		displayName: 'Occurred At',
		name: 'webHookEventOccurredAt',
		type: 'dateTime',
		default: '',
		description: 'WebHook Event Time',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'webHookEvent' ],
				operation: [ 'get' ],
			},
		},
	},
	{
		displayName: 'WebHook ID',
		name: 'webHookEventID',
		type: 'string',
		default: '',
		description: 'WebHook Event ID',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'webHookEvent' ],
				operation: [ 'get' ],
			},
		},
	},
];

// This contains the full list of webHookEvent fields
const fullWebHookEventDetails = `
accountId
appId
itemId
occuredAt
topic
`;

/**
 * Returns the GraphQL query string for the given webHookEvent
 * @param id The unique identifier of the web hook which is being triggered
 * @param accountId The unique identifier of the account which triggered the event
 * @param itemId The unique identifier of the object which triggered the event
 * @param occurredAt The time the event occurred at
 */
export function WebHookEventGenerateGetQuery(
	id: string,
	accountId: string,
	itemId: string,
	occurredAt: string
) {
	return `
		query WebHookEventQuery {
			webHookEvent(
				webHookId: "${id}",
				itemId: "${itemId}",
				accountId: "${accountId}",
				occuredAt: "${occurredAt}"
			) {
				${fullWebHookEventDetails}
			}
		}
		`;
}

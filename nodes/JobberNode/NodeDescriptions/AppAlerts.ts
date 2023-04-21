// NOTE: This **is not** tested, as a developer account **can not** use this API.
// This is here for example only, and it would be nice if someone tested this query.
import type {INodeProperties} from 'n8n-workflow';

export const AppAlertsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'get',
		required: true,
		options: [
			{
				name: 'List',
				value: 'list',
				action: 'List app alerts',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'appAlerts',
				],
			},
		},
	},
];

export const AppAlertsFields: INodeProperties[] = [
	{
		displayName: 'How many records',
		name: 'appAlertsQty',
		type: 'number',
		default: '10',
		description: 'How many records to return',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'appAlerts' ],
				operation: [ 'list' ],
			},
		},
	},
];

// This contains the full list of appAlerts fields
const fullAppAlertsDetails = `
app {
	applicationScopes
	author
	beforeStartingContent
	description
	id
	installationStepsContent
	learnMoreUrl
	logoUrl
	manageAppUrl
	marketplaceUrl
	name
	oauthUrl
	redirectUrl
}
count
updatedAt
`;

/**
 * Returns the GraphQL query string for getting app alerts
 */
export function AppAlertsGenerateListQuery() {
	return `
		query AppAlertsQuery {
			appAlerts {
				nodes {
					${fullAppAlertsDetails}
				}
			}
		}
		`;
}

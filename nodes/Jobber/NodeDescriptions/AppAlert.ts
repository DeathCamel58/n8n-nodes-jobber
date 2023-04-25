// NOTE: This **is not** tested, as a developer account **can not** use this API.
// This is here for example only, and it would be nice if someone tested this query.
import type {INodeProperties} from 'n8n-workflow';

export const AppAlertOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'list',
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
					'appAlert',
				],
			},
		},
	},
];

export const AppAlertFields: INodeProperties[] = [
	{
		displayName: 'How Many Records',
		name: 'appAlertsQty',
		type: 'number',
		default: 10,
		description: 'How many records to return',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'appAlert' ],
				operation: [ 'list' ],
			},
		},
	},
];

// This contains the full list of appAlerts fields
const fullAppAlertDetails = `
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
export function AppAlertGenerateListQuery() {
	return `
		query AppAlertsQuery {
			appAlerts {
				nodes {
					${fullAppAlertDetails}
				}
			}
		}
		`;
}

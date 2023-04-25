import type {INodeProperties} from 'n8n-workflow';

export const AccountOperations: INodeProperties[] = [
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
				action: 'Get account information',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'account',
				],
			},
		},
	},
];

export const AccountFields: INodeProperties[] = [];

// This contains the full list of account fields
const fullAccountDetails = `
createdAt
features {
	available
	enabled
	name
}
id
name
`;

/**
 * Returns the GraphQL query string for getting account information
 */
export function AccountGenerateGetQuery() {
	return `
		query AccountQuery {
			account {
				${fullAccountDetails}
			}
		}
		`;
}

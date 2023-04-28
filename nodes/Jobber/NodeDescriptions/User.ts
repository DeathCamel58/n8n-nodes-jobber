import type {INodeProperties} from 'n8n-workflow';

export const UserOperations: INodeProperties[] = [
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
				action: 'Get a user by their ID',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List users',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'user',
				],
			},
		},
	},
];

export const UserFields: INodeProperties[] = [
	{
		displayName: 'idQueryName',
		name: 'idQueryName',
		type: 'hidden',
		default: 'users',
		displayOptions: {
			show: {
				resource: [ 'user' ],
			},
		},
	},
	{
		displayName: 'uniqueName',
		name: 'uniqueName',
		type: 'hidden',
		// TODO: Figure out what to set this to
		// The address is in `name { full }`, but we currently can't get this in the list
		default: 'id',
		displayOptions: {
			show: {
				resource: [ 'user' ],
			},
		},
	},
	{
		displayName: 'User Name or ID',
		name: 'userID',
		type: 'options',
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getIds',
		},
		displayOptions: {
			show: {
				resource: [ 'user' ],
				operation: [ 'get' ],
			},
		},
	},
	{
		displayName: 'How Many Records',
		name: 'userQty',
		type: 'number',
		default: 10,
		description: 'How many records to return',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'user' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'User Status',
		name: 'userStatus',
		type: 'options',
		options: [
			{
				name: 'No Filter',
				value: '',
			},
			{
				name: 'Activated',
				value: 'ACTIVATED',
			},
			{
				name: 'Deactivated',
				value: 'DEACTIVATED',
			},
		],
		default: '',
		description: 'Only show activated/deactivated users',
		displayOptions: {
			show: {
				resource: [ 'user' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Minimal User Information',
		name: 'userMinimal',
		type: 'boolean',
		default: true,
		description: 'Because listing returns numerous users, listing all user information for each result can ' +
			'quickly hit the rate limit. By selecting this, only the user\'s name and ID will be returned.',
		displayOptions: {
			show: {
				resource: [ 'user' ],
				operation: [ 'list' ],
			},
		},
	},
	// TODO: Add permission filtering
];

// This contains the full list of user fields
const fullUserDetails = `
account {
	id
}
address {
	city
	coordinates {
		latitude
		latitudeString
		longitude
		longitudeString
		point
	}
	country
	geoStatus
	postalCode
	province
	street
	street1
	street2
}
apps {
	nodes {
		id
	}
}
email {
	isValid
	raw
}
firstDayOfTheWeek
franchiseTokenLastFour
id
isAccountAdmin
isAccountOwner
isCurrentUser
lastLoginAt
name {
	first
	full
	last
}
phone {
	areaCode
	countryCode
	friendly
}
status
timezone
`;

/**
 * Returns the GraphQL query string for the given user
 * @param id The ID of the user
 */
export function UserGenerateGetQuery(id: string) {
	return `
		query UserQuery {
			user(id: "${id}") {
				${fullUserDetails}
			}
		}
		`;
}

/**
 * Returns the GraphQL query string with the given settings
 * @param qty The number of users to return
 * @param userMinimal Should we only get minimal information?
 * @param userStatus What user account status to filter by
 */
export function UserGenerateListQuery(
	qty: number,
	userMinimal: boolean = false,
	userStatus: string = ''
) {
	// Build the arguments for the query
	let args = `first: ${qty}\n`;
	let filterAttributes = '';
	if (userStatus != '') {
		filterAttributes += 'filter: {\n';
		if (userStatus != '') {
			filterAttributes += `status: ${userStatus},\n`;
		}
		filterAttributes += '}';
	}
	args += filterAttributes;

	return `
		query UserQuery {
			users(
				${args}
			) {
				nodes {
					${userMinimal ? 'id\nname {\nfull\n}' : fullUserDetails}
				}
			}
		}
		`;
}

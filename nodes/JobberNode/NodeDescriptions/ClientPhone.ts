import type {INodeProperties} from 'n8n-workflow';

export const ClientPhoneOperations: INodeProperties[] = [
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
				action: 'Get a client phone by its ID',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List client phones',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'clientPhone',
				],
			},
		},
	},
];

export const ClientPhoneFields: INodeProperties[] = [
	{
		displayName: 'ID',
		name: 'clientPhoneID',
		type: 'string',
		default: '',
		description: 'Client phone ID',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'clientPhone' ],
				operation: [ 'get' ],
			},
		},
	},
	{
		displayName: 'How many records',
		name: 'clientPhoneQty',
		type: 'number',
		default: '10',
		description: 'How many records to return',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'clientPhone' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Search Term',
		name: 'clientPhoneSearch',
		type: 'string',
		default: '',
		description: 'Search term to look for',
		displayOptions: {
			show: {
				resource: [ 'clientPhone' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Minimal ClientPhone Information',
		name: 'clientPhoneMinimal',
		type: 'boolean',
		default: true,
		description: 'Because listing returns numerous clientPhones, listing all clientPhone information for each result can ' +
			'quickly hit the rate limit. By selecting this, only the clientPhone\'s name and ID will be returned.',
		displayOptions: {
			show: {
				resource: [ 'clientPhone' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'SMS Capability',
		name: 'clientPhoneSMS',
		type: 'options',
		options: [
			{
				name: 'No Filter',
				value: '',
			},
			{
				name: 'SMS Allowed',
				value: 'true',
			},
			{
				name: 'SMS Not Allowed',
				value: 'false',
			},
		],
		default: '',
		description: 'Filter client phones by SMS capability',
		displayOptions: {
			show: {
				resource: [ 'clientPhone' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'SMS Opted Out',
		name: 'clientPhoneSMSOptOut',
		type: 'options',
		options: [
			{
				name: 'No Filter',
				value: '',
			},
			{
				name: 'SMS Not Opted Out',
				value: 'false',
			},
			{
				name: 'SMS Opted Out',
				value: 'true',
			},
		],
		default: '',
		description: 'Filter client phones by SMS opt out status',
		displayOptions: {
			show: {
				resource: [ 'clientPhone' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'SMS Valid Number',
		name: 'clientPhoneSMSValid',
		type: 'options',
		options: [
			{
				name: 'No Filter',
				value: '',
			},
			{
				name: 'SMS Valid',
				value: 'true',
			},
			{
				name: 'SMS Not Valid',
				value: 'false',
			},
		],
		default: '',
		description: 'Filter client phones by SMS number validity',
		displayOptions: {
			show: {
				resource: [ 'clientPhone' ],
				operation: [ 'list' ],
			},
		},
	},
	// TODO: Add permission filtering
];

// This contains the full list of clientPhone fields
const fullClientPhoneDetails = `
client {
	id
}
description
friendly
id
normalizedPhoneNumber
number
primary
smsAllowed
`;

/**
 * Returns the GraphQL query string for the given clientPhone
 * @param id The ID of the clientPhone
 */
export function ClientPhoneGenerateGetQuery(id: string) {
	return `
		query ClientPhoneQuery {
			clientPhone(id: "${id}") {
				${fullClientPhoneDetails}
			}
		}
		`;
}

/**
 * Returns the GraphQL query string with the given settings
 * @param qty The number of clientPhones to return
 * @param search The search term to use
 * @param clientPhoneMinimal Should we only get minimal information?
 * @param clientPhoneStatus What clientPhone account status to filter by
 */
export function ClientPhoneGenerateListQuery(
	qty: number,
	search: string = '',
	clientPhoneMinimal: boolean = true,
	clientPhoneSMS: string = '',
	clientPhoneSMSOptOut: string = '',
	clientPhoneSMSValid: string = ''
) {
	// Build the arguments for the query
	let args = `first: ${qty}\n`;
	if (search) {
		args += `searchTerm: "${search}"\n`;
	}
	let filterAttributes = '';
	if (clientPhoneSMS != '' ||	clientPhoneSMSOptOut != '' ||	clientPhoneSMSValid != '') {
		filterAttributes += 'filter: {\n';
		if (clientPhoneSMS != '') {
			filterAttributes += `smsAllowed: ${clientPhoneSMS},\n`;
		}
		if (clientPhoneSMSOptOut != '') {
			filterAttributes += `smsStopped: ${clientPhoneSMSOptOut},\n`;
		}
		if (clientPhoneSMSValid != '') {
			filterAttributes += `isValidSmsPhoneNumber: ${clientPhoneSMSValid},\n`;
		}
		filterAttributes += '}';
	}
	args += filterAttributes;

	return `
		query ClientPhoneQuery {
			clientPhones(
				${args}
			) {
				nodes {
					${clientPhoneMinimal ? 'id\nnumber' : fullClientPhoneDetails}
				}
			}
		}
		`;
}

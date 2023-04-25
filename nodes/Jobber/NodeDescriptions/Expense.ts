import type {INodeProperties} from 'n8n-workflow';

export const ExpenseOperations: INodeProperties[] = [
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
				action: 'Get an expense by its ID',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List expenses',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'expense',
				],
			},
		},
	},
];

export const ExpenseFields: INodeProperties[] = [
	{
		displayName: 'ID',
		name: 'expenseID',
		type: 'string',
		default: '',
		description: 'Expense ID',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'expense' ],
				operation: [ 'get' ],
			},
		},
	},
	{
		displayName: 'How Many Records',
		name: 'expenseQty',
		type: 'number',
		default: 10,
		description: 'How many records to return',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'expense' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'User ID',
		name: 'expenseFilterUser',
		type: 'string',
		default: '',
		description: 'Only return expenses entered by given user ID',
		displayOptions: {
			show: {
				resource: [ 'expense' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Reimburse User ID',
		name: 'expenseFilterReimburseUser',
		type: 'string',
		default: '',
		description: 'Only return expenses that are reimbursable to given user ID',
		displayOptions: {
			show: {
				resource: [ 'expense' ],
				operation: [ 'list' ],
			},
		},
	},
	{
		displayName: 'Minimal Expense Information',
		name: 'expenseMinimal',
		type: 'boolean',
		default: true,
		description: 'Because listing returns numerous expenses, listing all expense information for each result can ' +
			'quickly hit the rate limit. By selecting this, only the expense\'s name and ID will be returned.',
		displayOptions: {
			show: {
				resource: [ 'expense' ],
				operation: [ 'list' ],
			},
		},
	},
	// TODO: Add creation date filtering
	// TODO: Add update date filtering
	// TODO: Add date filtering
	// TODO: Add sorting
];

// This contains the full list of expense fields
const fullExpenseDetails = `
createdAt
date
description
enteredBy {
	id
}
id
linkedJob {
	id
}
paidBy {
	id
}
reimbursableTo {
	id
}
title
total
updatedAt
`;

/**
 * Returns the GraphQL query string for the given expense
 * @param id The ID of the expense
 */
export function ExpenseGenerateGetQuery(id: string) {
	return `
		query ExpenseQuery {
			expense(id: "${id}") {
				${fullExpenseDetails}
			}
		}
		`;
}

/**
 * Returns the GraphQL query string with the given settings
 * @param qty The number of expenses to return
 * @param expenseMinimal Should we only get minimal information?
 * @param expenseUser Return expenses entered by user
 * @param expenseReimburseUser Return expenses reimbursable to user ID
 */
export function ExpenseGenerateListQuery(
	qty: number,
	expenseMinimal: boolean = false,
	expenseUser: string = '',
	expenseReimburseUser: string = ''
) {
	// Build the arguments for the query
	let args = `first: ${qty}\n`;
	let filterAttributes = '';
	if (expenseUser != '' || expenseReimburseUser != '') {
		filterAttributes += 'filter: {\n';
		if (expenseUser != '') {
			filterAttributes += `enteredById: ${expenseUser},\n`;
		}
		if (expenseReimburseUser != '') {
			filterAttributes += `reimbursableToId: ${expenseReimburseUser},\n`;
		}
		filterAttributes += '}';
	}
	args += filterAttributes;

	return `
		query ExpenseQuery {
			expenses(
				${args}
			) {
				nodes {
					${expenseMinimal ? 'id\ntitle' : fullExpenseDetails}
				}
			}
		}
		`;
}

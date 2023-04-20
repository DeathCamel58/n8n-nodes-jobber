import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { apiJobberApiRequest } from "./GenericFunctions";

import { GraphQLFields, GraphQLOperations } from './NodeDescriptions/GraphQL';
import { ClientFields, ClientOperations, ClientGenerateGetQuery, ClientGenerateListQuery } from './NodeDescriptions/Client';
import { InvoiceFields, InvoiceOperations, InvoiceGenerateGetQuery, InvoiceGenerateListQuery } from './NodeDescriptions/Invoice';
import { JobFields, JobOperations, JobGenerateGetQuery, JobGenerateListQuery } from './NodeDescriptions/Job';
import { QuoteFields, QuoteOperations, QuoteGenerateGetQuery, QuoteGenerateListQuery } from './NodeDescriptions/Quote';

export class Jobber implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Jobber',
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		name: 'jobber',
		icon: 'file:jobber.svg',
		group: ['transform'],
		version: 1,
		description: 'Makes a Jobber API request and returns the received data',
		defaults: {
			name: 'Jobber',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'jobberOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'GraphQL',
						value: 'graphql',
					},
					// TODO: Add `account`
					// TODO: Add `appAlerts`
					// TODO: Add `assessment`
					// TODO: Add `capitalLoans`
					// TODO: Add `capitalLoans`
					{
						name: 'Client',
						value: 'client',
					},
					// TODO: Add `clientEmails`
					// TODO: Add `clientPhone`
					// TODO: Add `event`
					// TODO: Add `expense`
					// TODO: Add `expenses`
					{
						name: 'Invoice',
						value: 'invoice',
					},
					{
						name: 'Job',
						value: 'job',
					},
					// TODO: Add `paymentRecord`
					// TODO: Add `paymentRecords`
					// TODO: Add `payoutRecord`
					// TODO: Add `payoutRecords`
					// TODO: Add `productOrService`
					// TODO: Add `productOrServices`
					// TODO: Add `products`
					// TODO: Add `productsSearch`
					// TODO: Add `properties`
					// TODO: Add `property`
					{
						name: 'Quote',
						value: 'quote',
					},
					// TODO: Add `request`
					// TODO: Add `requestSettings`
					// TODO: Add `requests`
					// TODO: Add `scheduledItems`
					// TODO: Add `task`
					// TODO: Add `taxRates`
					// TODO: Add `timeSheetEntry`
					// TODO: Add `timeSheetEntries`
					// TODO: Add `user`
					// TODO: Add `users`
					// TODO: Add `visit`
					// TODO: Add `visits`
					// TODO: Add `webHookEvent`
				],
				default: 'graphql',
			},

			// GraphQL
			...GraphQLOperations,
			...GraphQLFields,

			// Client
			...ClientOperations,
			...ClientFields,

			// Invoice
			...InvoiceOperations,
			...InvoiceFields,

			// Job
			...JobOperations,
			...JobFields,

			// Quote
			...QuoteOperations,
			...QuoteFields,

			// Header Parameters
			{
				displayName: 'Jobber GraphQL Version',
				name: 'jobberGraphQLVersion',
				type: 'options',
				options: [
					/**
					 * These API versions can be found at: https://developer.getjobber.com/docs/changelog
					 * NOTE: Do not include versions in the "Historic API Versions" section, as these versions will not return a
					 * consistent response. This is due to the API returning the closest version possible to these.
					 */
					{
						name: '2022-03-10',
						value: '2022-03-10',
					},
					{
						name: '2022-05-23',
						value: '2022-05-23',
					},
					{
						name: '2022-09-15',
						value: '2022-09-15',
					},
					{
						name: '2022-12-07',
						value: '2022-12-07',
					},
					{
						name: '2023-03-29',
						value: '2023-03-29',
					},
				],
				default: '2023-03-29',
				description: 'The format in which the data gets returned from the URL',
			},

			{
				displayName: 'Hide API Extensions',
				name: 'hideAPIExtensions',
				type: 'boolean',
				default: true,
				description: 'Hides the API extensions from the output of this node. This includes rate limit information, API' +
					'version, and some additional things that we probably don\'t need as an output from this node.',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const length = items.length;

		let responseData;

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);
		const jobberGraphQLVersion = this.getNodeParameter('jobberGraphQLVersion', 0) as string;
		const hideAPIExtensions = this.getNodeParameter('hideAPIExtensions', 0) as boolean;

		if (resource === 'graphql') {
			if (operation === 'send') {
				for (let i = 0; i < length; i++) {
					try {
						const gqlQuery = this.getNodeParameter('query', i, '') as string;
						const gqlVariables = this.getNodeParameter('variables', i, {}) as object;

						responseData = await apiJobberApiRequest.call(this, jobberGraphQLVersion, hideAPIExtensions, gqlQuery, gqlVariables);

						returnData.push(responseData as IDataObject);
					} catch (error) {
						if (this.continueOnFail()) {
							returnData.push({json: {error: error.message}});
							continue;
						}
						throw error;
					}
				}
			}
		} else if (resource === 'client') {
			if (operation === 'get') {
				for (let i = 0; i < length; i++) {
					try {
						const id = this.getNodeParameter('clientID', i, '') as string;

						const gqlQuery = ClientGenerateGetQuery(id);

						responseData = await apiJobberApiRequest.call(this, jobberGraphQLVersion, hideAPIExtensions, gqlQuery, {});

						returnData.push(responseData as IDataObject);
					} catch (error) {
						if (this.continueOnFail()) {
							returnData.push({json: {error: error.message}});
							continue;
						}
						throw error;
					}
				}
			} else if (operation === 'list') {
				for (let i = 0; i < length; i++) {
					try {
						const qty = this.getNodeParameter('clientQty', i, '') as number;
						const minimal = this.getNodeParameter('clientMinimal', i, '') as boolean;
						const search = this.getNodeParameter('clientSearch', i, '') as string;
						const filterCompanies = this.getNodeParameter('clientFilterCompanies', i, '') as boolean;
						const filterLeads = this.getNodeParameter('clientFilterLeads', i, '') as boolean;
						const filterArchived = this.getNodeParameter('clientFilterArchived', i, '') as boolean;

						const gqlQuery = ClientGenerateListQuery(qty, search, minimal, filterCompanies, filterLeads, filterArchived);

						responseData = await apiJobberApiRequest.call(this, jobberGraphQLVersion, hideAPIExtensions, gqlQuery, {});

						returnData.push(responseData as IDataObject);
					} catch (error) {
						if (this.continueOnFail()) {
							returnData.push({json: {error: error.message}});
							continue;
						}
						throw error;
					}
				}
			}
		} else if (resource === 'invoice') {
			if (operation === 'get') {
				for (let i = 0; i < length; i++) {
					try {
						const id = this.getNodeParameter('invoiceID', i, '') as string;

						const gqlQuery = InvoiceGenerateGetQuery(id);

						responseData = await apiJobberApiRequest.call(this, jobberGraphQLVersion, hideAPIExtensions, gqlQuery, {});

						returnData.push(responseData as IDataObject);
					} catch (error) {
						if (this.continueOnFail()) {
							returnData.push({json: {error: error.message}});
							continue;
						}
						throw error;
					}
				}
			} else if (operation === 'list') {
				for (let i = 0; i < length; i++) {
					try {
						const qty = this.getNodeParameter('invoiceQty', i, '') as number;
						const minimal = this.getNodeParameter('invoiceMinimal', i, '') as boolean;
						const search = this.getNodeParameter('invoiceSearch', i, '') as string;
						const id = this.getNodeParameter('invoiceFilterCompanies', i, '') as string;
						const client = this.getNodeParameter('invoiceFilterClient', i, '') as string;
						const number = this.getNodeParameter('invoiceFilterNumber', i, '') as string;

						const gqlQuery = InvoiceGenerateListQuery(qty, search, minimal, id, client, number);

						responseData = await apiJobberApiRequest.call(this, jobberGraphQLVersion, hideAPIExtensions, gqlQuery, {});

						returnData.push(responseData as IDataObject);
					} catch (error) {
						if (this.continueOnFail()) {
							returnData.push({json: {error: error.message}});
							continue;
						}
						throw error;
					}
				}
			}
		} else if (resource === 'job') {
			if (operation === 'get') {
				for (let i = 0; i < length; i++) {
					try {
						const id = this.getNodeParameter('jobID', i, '') as string;

						const gqlQuery = JobGenerateGetQuery(id);

						responseData = await apiJobberApiRequest.call(this, jobberGraphQLVersion, hideAPIExtensions, gqlQuery, {});

						returnData.push(responseData as IDataObject);
					} catch (error) {
						if (this.continueOnFail()) {
							returnData.push({json: {error: error.message}});
							continue;
						}
						throw error;
					}
				}
			} else if (operation === 'list') {
				for (let i = 0; i < length; i++) {
					try {
						const qty = this.getNodeParameter('jobQty', i, '') as number;
						const minimal = this.getNodeParameter('jobMinimal', i, '') as boolean;
						const search = this.getNodeParameter('jobSearch', i, '') as string;
						const unscheduled = this.getNodeParameter('jobFilterUnscheduled', i, '') as boolean;

						const gqlQuery = JobGenerateListQuery(qty, search, minimal, unscheduled);

						responseData = await apiJobberApiRequest.call(this, jobberGraphQLVersion, hideAPIExtensions, gqlQuery, {});

						returnData.push(responseData as IDataObject);
					} catch (error) {
						if (this.continueOnFail()) {
							returnData.push({json: {error: error.message}});
							continue;
						}
						throw error;
					}
				}
			}
		} else if (resource === 'quote') {
			if (operation === 'get') {
				for (let i = 0; i < length; i++) {
					try {
						const id = this.getNodeParameter('quoteID', i, '') as string;

						const gqlQuery = QuoteGenerateGetQuery(id);

						responseData = await apiJobberApiRequest.call(this, jobberGraphQLVersion, hideAPIExtensions, gqlQuery, {});

						returnData.push(responseData as IDataObject);
					} catch (error) {
						if (this.continueOnFail()) {
							returnData.push({json: {error: error.message}});
							continue;
						}
						throw error;
					}
				}
			} else if (operation === 'list') {
				for (let i = 0; i < length; i++) {
					try {
						const qty = this.getNodeParameter('quoteQty', i, '') as number;
						const minimal = this.getNodeParameter('quoteMinimal', i, '') as boolean;
						const search = this.getNodeParameter('quoteSearch', i, '') as string;
						const client = this.getNodeParameter('quoteClient', i, '') as string;
						const number = this.getNodeParameter('quoteNumber', i, '') as string;

						const gqlQuery = QuoteGenerateListQuery(qty, search, minimal, client, number);

						responseData = await apiJobberApiRequest.call(this, jobberGraphQLVersion, hideAPIExtensions, gqlQuery, {});

						returnData.push(responseData as IDataObject);
					} catch (error) {
						if (this.continueOnFail()) {
							returnData.push({json: {error: error.message}});
							continue;
						}
						throw error;
					}
				}
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}

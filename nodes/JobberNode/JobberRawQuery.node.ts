import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

import type { OptionsWithUri } from 'request';
import type { RequestPromiseOptions } from 'request-promise-native';

export class JobberRawQuery implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Jobber Raw Query',
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
				displayName: 'Request Format',
				name: 'requestFormat',
				type: 'options',
				required: true,
				options: [
					{
						name: 'GraphQL (Raw)',
						value: 'graphql',
					},
					{
						name: 'JSON',
						value: 'json',
					},
				],
				default: 'graphql',
				description: 'The format for the query payload',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'json',
				default: '',
				description: 'GraphQL query',
				required: true,
			},
			{
				displayName: 'Variables',
				name: 'variables',
				type: 'json',
				default: '',
				description: 'Query variables',
				displayOptions: {
					show: {
						requestFormat: ['json'],
					},
				},
			},

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
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let requestOptions: OptionsWithUri & RequestPromiseOptions;

		const returnItems: INodeExecutionData[] = [];
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const requestMethod = 'POST' as string;
				const endpoint = 'https://api.getjobber.com/api/graphql' as string;
				const requestFormat = this.getNodeParameter(
					'requestFormat',
					itemIndex,
					'graphql',
				) as string;

				const jobberGraphQLVersion = this.getNodeParameter('jobberGraphQLVersion', 0) as string;

				requestOptions = {
					headers: {
						'content-type': `application/${requestFormat}`,
						'X-JOBBER-GRAPHQL-VERSION': jobberGraphQLVersion,
					},
					method: requestMethod,
					uri: endpoint,
					simple: false,
					rejectUnauthorized: true,
				};

				const gqlQuery = this.getNodeParameter('query', itemIndex, '') as string;
				if (requestFormat === 'json') {
					requestOptions.body = {
						query: gqlQuery,
						variables: this.getNodeParameter('variables', itemIndex, {}) as object,
					};
					if (typeof requestOptions.body.variables === 'string') {
						try {
							requestOptions.body.variables = JSON.parse(
								(requestOptions.body.variables as string) || '{}',
							);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								'Using variables failed:\n' +
								(requestOptions.body.variables as string) +
								'\n\nWith error message:\n' +
								(error as string),
								{ itemIndex },
							);
						}
					}
					requestOptions.json = true;
				} else {
					requestOptions.body = gqlQuery;
				}

				let response;
				// Now that the options are all set make the actual http request
				response = await this.helpers.requestOAuth2.call(this, 'jobberOAuth2Api', requestOptions, {
					tokenType: 'Bearer',
				});

				if (typeof response === 'string') {
					try {
						response = JSON.parse(response);
					} catch (error) {
						throw new NodeOperationError(
							this.getNode(),
							'Response body is not valid JSON. Change "Response Format" to "String"',
							{ itemIndex },
						);
					}
				}

				if (response.errors) {
					const message =
						response.errors?.map((error: IDataObject) => error.message).join(', ') ||
						'Unexpected error';
					throw new NodeApiError(this.getNode(), response.errors as JsonObject, { message });
				}
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(response as IDataObject),
					{ itemData: { item: itemIndex } },
				);
				returnItems.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const errorData = this.helpers.returnJsonArray({
						$error: error,
						json: this.getInputData(itemIndex),
						itemIndex,
					});
					const exectionErrorWithMetaData = this.helpers.constructExecutionMetaData(errorData, {
						itemData: { item: itemIndex },
					});
					returnItems.push(...exectionErrorWithMetaData);
					continue;
				}
				throw error;
			}
		}

		return this.prepareOutputData(returnItems);
	}
}

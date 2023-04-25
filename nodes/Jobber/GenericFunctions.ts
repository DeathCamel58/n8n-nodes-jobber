import type { OptionsWithUri } from 'request';

import type { IExecuteFunctions, ILoadOptionsFunctions, JsonObject } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

/**
 * Sends a GraphQL request to the Jobber API
 * @param jobberGraphQLVersion The value of `X-JOBBER-GRAPHQL-VERSION` to send in the request header
 * @param hideAPIExtensions Should we strip out the API extensions from the result?
 * @param query The GraphQL query to run
 * @param variables Any variables in the query
 */
export async function apiJobberApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	jobberGraphQLVersion: string,
	hideAPIExtensions: boolean,
	query: string,
	variables = {},
) {
	const options: OptionsWithUri = {
		headers: {
			'user-agent': 'n8n',
			Accept: `application/json`,
			'X-JOBBER-GRAPHQL-VERSION': jobberGraphQLVersion,
		},
		method: 'POST',
		uri: 'https://api.getjobber.com/api/graphql',
		body: {
			query,
			variables,
		},
		json: true,
	};

	if (!Object.keys(query).length) {
		delete options.body;
	}

	try {
		let response = await this.helpers.requestOAuth2.call(
			this,
			'jobberOAuth2Api',
			options,
			{
				tokenType: 'Bearer',
			}
		);
		if (response.status === 'error') {
			throw new NodeApiError(this.getNode(), response.message as JsonObject);
		}

		if (hideAPIExtensions) {
			delete response.extensions;
		}

		return response;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

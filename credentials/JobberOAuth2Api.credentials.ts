import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class JobberOAuth2Api implements ICredentialType {
	name = 'jobberOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Jobber OAuth2 API';

	documentationUrl = 'jobber';

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://api.getjobber.com/api/oauth/authorize',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://api.getjobber.com/api/oauth/token',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
		{
			displayName:
				'If you get an Invalid Scopes error, make sure you add the correct one <a target="_blank" href="https://docs.n8n.io/integrations/builtin/credentials/slack/#using-oauth">here</a> to your Slack integration',
			name: 'notice',
			type: 'notice',
			default: '',
		},
	];
}

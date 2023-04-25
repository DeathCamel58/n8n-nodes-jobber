import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class JobberOAuth2Api implements ICredentialType {
	name = 'jobberOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Jobber OAuth2 API';

	documentationUrl = 'https://github.com/DeathCamel58/n8n-nodes-jobber';

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
				'If you get a permission or scopes error, you\'ll need to add them to your app in the <a target="_blank" href="https://developer.getjobber.com/">Jobber Developer</a> center.',
			name: 'notice',
			type: 'notice',
			default: '',
		},
	];
}

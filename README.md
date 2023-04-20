# n8n-nodes-jobber

This is an n8n community node. It lets you use [Jobber](https://getjobber.com) in your n8n workflows.

Jobber is a CMS aimed at service businesses.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  <!-- delete if no auth needed -->  
[Compatibility](#compatibility)  
[Usage](#usage)  <!-- delete if not using this section -->  
[Resources](#resources)  
[Version history](#version-history)  <!-- delete if not using this section -->

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

Arbitrary [GraphQL](https://graphql.org/) requests against the Jobber API

## Credentials

To use these nodes, you will need a paid subscription for Jobber, and a Jobber Developer account.

### How do I set this up?

1. You'll need to create a Jobber Developer account at https://developer.getjobber.com/.
2. Once signed up, create a Jobber App by following these steps:
   1. Click `+ New` in the top right
   2. Fill out the fields in the `Details` section. *Note*: This was tested without any callback URL, and worked for me.
   3. Depending on what kinds of queries you'll be doing with this, set the appropriate `scopes`.
   4. Click `Save App` at the bottom.
   5. Scroll to the bottom of the app page, and save the `Authorization` section for later.
3. Create the credential in n8n
   1. Click on `Credentials` on the left navigation bar
   2. Click `Add Credential`
   3. Search for `Jobber OAuth2 API`
   4. Click `Continue`
   5. Fill out the `Client ID` and `Client Secret` from the Jobber App's page
Now you can add the `Jobber` nodes to your workflows!

## Compatibility

Minimum n8n version: Unknown

Tested against: `0.222.3`

## Usage

_This is an optional section. Use it to help users with any difficult or confusing aspects of the node._

_By the time users are looking for community nodes, they probably already know n8n basics. But if you expect new users, you can link to the [Try it out](https://docs.n8n.io/try-it-out/) documentation to help them get started._

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Jobber Documentation](https://developer.getjobber.com/docs/)

## Version history

### `0.0.1`
* Added raw GraphQL query support

# mw.js
> Typed MediaWiki API client for node.js using TypeScript.

Perform different actions over the MediaWiki API, both logged out and logged in.

- [mw.js](#mwjs)
- [Installation](#installation)
- [Usage](#usage)
	- [Wiki Network](#wiki-network)
		- [Fandom](#fandom)

# Installation
```
# npm
npm i mw.js

# yarn
yarn add mw.js
```

# Usage
> For a wiki network like Fandom, refer to [§ Wiki Network](#wiki-network).

Create a generic `Wiki` instance for any wiki using the `Wiki` class. The only mandatory parameter is the URL to its `/api.php`:

```ts
import { Wiki } from 'mw.js'
const wikipedia = new Wiki( {
	api: 'https://en.wikipedia.org/w/api.php'
} )
```

To log in into a bot account using your [BotPasswords](https://www.mediawiki.org/wiki/Manual:Bot_passwords) credentials, create a `Bot` instance as follows:

```ts
import { Bot, Wiki } from 'mw.js'
const wikipedia = new Wiki( {
	api: 'https://en.wikipedia.org/w/api.php'
} )
const bot = new Bot( {
	password: 'YOUR_PASSWORD',
	username: 'Username@Botname',
	wiki: wikipedia
} )
await bot.login()
```

The pervious code will log in into your bot account on English Wikipedia. After that, you can perform any action your bot's passwords allows.

You only need to login if you wish to perform an action that requires an user's token, like a CSRF token (e.g. deleting, editing or protecting a page). For querying pages, `Wiki` is more than enough.

## Wiki Network
If you only need to work on a single wiki, the previous example should work for you. However, `mw.js` exports a `Fandom` class that facilitates some useful utilities for [Fandom](https://community.fandom.com)'s wikis.

Other Wiki Networks may be added in the future, but feel free to create a PR and add your own.

### Fandom
Fandom's class allows to get wikis using only their interwiki. In case you are not familiar with interwikis:

<table>
	<tr>
		<th> Interwiki </th>
		<th> URL </th>
	</tr>
	<tr>
		<td> community </td>
		<td> https://community.fandom.com </td>
	</tr>
	<tr>
		<td> es.genshin-impact </td>
		<td> https://genshin-impact.fandom.com/es </td>
	</tr>
	<tr>
		<td> pl.gothic </td>
		<td> https://gothic.fandom.com/pl </td>
	</tr>
</table>

To instantiate a `FandomWiki`, it is advisable to instantiate `Fandom` first:

```ts
import { Fandom } from 'mw.js'
const fandom = new Fandom()
const wiki = fandom.getWiki( 'es.genshin-impact' )
```

You can also login into an account through a `Fandom`'s method:

```ts
import { Fandom } from 'mw.js'
const fandom = new Fandom()
const wiki = fandom.getWiki( 'es.genshin-impact' )
const bot = await fandom.login( {
	password: 'YOUR_PASSWORD',
	username: 'Username@Botname',
	wiki
} )
```

**Unlike `Bot#login`, `Fandom#login` returns a `FandomBot` instance after logging in.**

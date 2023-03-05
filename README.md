<div style="text-align: center;">

![Logo](https://avatars.githubusercontent.com/u/126923974?s=200&v=4)

[![GitHub](https://img.shields.io/github/license/sapphiredev/framework)](https://github.com/wikiscript-js/core/blob/main/LICENSE.md)
[![npm](https://img.shields.io/npm/v/@quority/core?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@sapphire/framework)
</div>

---
Typed MediaWiki API wrapper for node.js, focused on supporting [MediaWiki's Action API](https://www.mediawiki.org/wiki/API:Main_page).

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
	- [Wiki instance](#wiki-instance)
	- [Custom strategy](#custom-strategy)
	- [Log in](#log-in)

# Features
- Written in TypeScript.
- Extendable API.
- Full TypeScript and JavaScript support.
- Can be used with CJS (`require`) or ESM (`import`).

# Installation
```bash
# npm
npm install @quority/core

# yarn
yarn add @quority/core
```

# Usage
For most uses, you will want to import the `Wiki` constructor. Code snippets will use ESM syntax, but you can use `require` instead:

```ts
// ESM
import { Wiki } from '@quority/core'

// CJS
const { Wiki } = require( '@quority/core' )
```

## Wiki instance
```ts
import { Wiki } from '@quority/core'

const wiki = new Wiki( {
	api: 'https://www.mediawiki.org/w/api.php'
} )
```

By default, you'll need to use the API url for the wiki. This behavior can be changed using a strategy.

## Custom strategy
Strategies allow you to add support to custom features for a MediaWiki installation, or to change how is the api interpreted in the wiki's constructor.

The following example will allow you to create `Wiki` instances for a Wikipedia by just defining its language in the `api` property of the constructor.

```ts
import { BaseStrategy } from '@quority/core'

class WikipediaStrategy extends BaseStrategy {
	public static override getApi( api: string ): URL {
		return new URL( `https://${ api }.wikipedia.org/w/api.php` )
	}
}
```
> :warning: You might want to throw an error if the parameter isn't a language code.

The strategy can be manually set in the constructor of an instance:

```ts
const wiki = new Wiki( {
	api: 'es',
	platform: WikipediaStrategy
} )
```

Or you can extend a class that will use your custom strategy by default:

```ts
class Wikipedia extends Wiki {
	public static override readonly defaultStrategy = WikipediaStrategy
}

const wiki = new Wikipedia( {
	api: 'es'
} )
```

Strategies can also be used to add support to different API endpoints that aren't included in default MediaWiki installations. This is pending to be documented.

## Log in
You can login to get a `Bot` instance by using the `#login` method in `Wiki`.

```ts
import { Wiki } from '@quority/core'

const wiki = new Wiki( {
	api: 'https://www.mediawiki.org/w/api.php'
} )
const bot = await wiki.login( 'BotPasswords user', 'BotPasswords password' )
```
> :floppy_disk: If you aren't familiar with [BotPasswords](https://www.mediawiki.org/wiki/Manual:Bot_passwords), you may find useful to read [Bot passwords & you (& your bot (& you))](https://river.me/blog/bot-passwords/)

The bot instance supports most actions that can be performed through the API as individual methods:

```ts
await bot.edit( {
	text: 'This is a test',
	title: 'Test'
} )
```

All actions will be made on the wiki that created the instance.
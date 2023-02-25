import { BaseStrategy } from './BaseStrategy'
import { s } from '@sapphire/shapeshift'
import { InvalidInterwikiError } from '../errors'

export class FandomStrategy extends BaseStrategy {
	public static readonly InterwikiRegex = /^([a-z-]{2,5}\.)?[a-z0-9-]+$/
	public readonly InterwikiRegex = FandomStrategy.InterwikiRegex

	public static readonly InterwikiValidator = s.string.regex( FandomStrategy.InterwikiRegex )
	public readonly InterwikiValidator = FandomStrategy.InterwikiValidator

	public static readonly services = new URL( 'https://services.fandom.com/' )
	public readonly services = FandomStrategy.services

	public override getApi( api: string ): URL {
		if ( this.InterwikiValidator.run( api ).isOk() ) {
			const url = FandomStrategy.interwiki2base( api )
			url.pathname = `${ url.pathname }api.php`
			return url
		} else {
			return new URL( api )
		}
	}

	public static interwiki2base( interwiki: string ): URL {
		if ( interwiki.match( /^[a-z0-9-]+\.[a-z0-9-]+/i ) ) {
			const [ lang, name ] = interwiki.split( '.' )
			return new URL( `https://${ name }.fandom.com/${ lang }/` )
		} else if ( interwiki.match( /^[a-z-0-9-]+$/i ) ) {
			return new URL( `https://${ interwiki }.fandom.com/` )
		}
		throw new InvalidInterwikiError( interwiki )
	}

	public async getUserId( username: string ): Promise<number | null> {
		const query = await this.wiki.queryList( {
			list: 'users',
			ususers: username
		} )
		return query[ 0 ]?.userid ?? null
	}

	public async getUserAttr( username: string, attr: 'avatar' | 'bio' | 'discordHandle' | 'name' | 'nickname' ): Promise<string | null> {
		const userId = await this.getUserId( username )
		if ( !userId ) return null

		const { body } = await this.wiki.request.raw( new URL( `/user-attribute/user/${ userId }/attr/${ attr }`, this.services ) )
		const res = await body.json() as {
			name: string
			value: string
		}

		return res.value
	}
}

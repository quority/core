import {
	Signale
} from 'signale'

const signaleTypes = {
	account: {
		badge: '👾',
		color: 'blue',
		label: 'Account',
		logLevel: 'info'
	},
	community: {
		badge: '🌟',
		color: 'yellow',
		label: 'Wiki',
		logLevel: 'info'
	}
}

export const Logger = new Signale<keyof typeof signaleTypes>( {
	config: {
		displayTimestamp: true
	},
	disabled: false,
	interactive: false,
	secrets: [],
	stream: process.stdout,
	types: signaleTypes
} )

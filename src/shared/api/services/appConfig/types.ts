export type SelectOptionValue = string | number

export type SelectOption = {
	value: SelectOptionValue
	label: string
	iconUrl?: string
}

export type ShowVariantsOption = {
	value: string
	label: string
}

export type SocialKey =
	| "site"
	| "vk"
	| "Instagram"
	| "Telegram"
	| "GitHub"
	| string

export interface ISocial {
	id: number | string
	link: string
	icon: string
	name: string
	key: SocialKey
}

export type SocialKeys = keyof ISocial

export interface IBlock {
	id: number
	blockName?: string
	text?: string
	punkts?: string[]
}

export interface IAbout {
	blocks: IBlock[]
}

export interface IAplication {
	about: IAbout
	appName: string
	developer: {
		icon: string
		link: string
		text?: string
	}
	socials: ISocial[]
	version: string
	showVariantsList: ShowVariantsOption[]
	privacy_policy_link: string
	showVKAuth: boolean
	updated_at: string
}

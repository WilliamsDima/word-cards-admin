export type ResponseApi<T> = {
	data: T
}

export type SelectOptionValue = string | number

export type SelectOption = {
	value: SelectOptionValue
	label: string
	iconUrl?: string
}

export interface ISocial {
	id: number
	link: string
	icon: string
	name: string
}

export interface IBlock {
	id: number
	blockName?: string
	text?: string
	punkts?: string[]
}

export interface IAbout {
	blocks: IBlock[]
}

export type TranslationKeys =
	| "ru"
	| "uk"
	| "be"
	| "ka"
	| "uz"
	| "az"
	| "tg"
	| "en"
	| "de"
	| "fr"
	| "es"
	| "it"
	| "pt"
	| "nl"
	| "sv"
	| "no"
	| "fi"
	| "da"
	| "pl"
	| "cs"
	| "hu"
	| "tr"
	| "ar"
	| "he"
	| "zh"
	| "ja"
	| "ko"
	| "hi"
	| "bn"
	| "pa"
	| "vi"
	| "th"
	| "id"
	| "ms"
	| "fa"
	| "sw"
	| "ro"
export type TranslationsType = Record<TranslationKeys, string>

export type AppLanguageType = {
	name: string
	nativeName: string
	code: TranslationKeys
	id: number
}
export type AppLanguagesType = Record<TranslationKeys, AppLanguageType>

export interface IAplication {
	about: IAbout
	appName: string
	developer: {
		icon: string
		link: string
		text: string
	}
	socials: ISocial[]
	version: string
	showVariantsList: SelectOption[]
	privacy_policy_link: string
	showVKAuth: boolean
	translations: TranslationsType
	appLanguages: AppLanguagesType
}

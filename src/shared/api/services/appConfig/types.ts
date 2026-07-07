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

export const YEAR_IN_REVIEW_SLIDE_IDS = [
	"intro",
	"cards_added",
	"cards_learned",
	"practice_sessions",
	"streak",
	"daily_tasks",
	"app_opens",
	"cards_reviewed",
	"languages",
	"outro",
] as const

export type YearInReviewSlideId = (typeof YEAR_IN_REVIEW_SLIDE_IDS)[number]

export interface IYearInReviewWindow {
	start_month: number
	start_day: number
	end_month: number
	end_day: number
	end_hour: number
	end_minute: number
}

export interface IYearInReviewTranslation {
	title: string
	description: string
}

export interface IYearInReviewSlide {
	id: YearInReviewSlideId
	enabled: boolean
	sort_order: number
	translations: Record<string, IYearInReviewTranslation>
}

export interface IYearInReviewConfig {
	window: IYearInReviewWindow
	slides: IYearInReviewSlide[]
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
	year_in_review: IYearInReviewConfig
	updated_at: string
}

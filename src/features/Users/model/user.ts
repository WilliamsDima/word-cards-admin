export type ShowVariantListVale =
	| "translate_only"
	| "word_only"
	| "word_and_translate"

export type ShowVariantList = {
	label: string
	value: ShowVariantListVale
}

export interface ILanguage {
	id: number
	full_name: string
	short_name: string
	country: {
		id: number
		title: string
		flag: string
	}
}

export interface IActivityMonth {
	addedCards: number // добавлено карточек за месяц ✅
	viewedAds: number // количество просмотренной рекламмы ✅
	openApp: number // количество заходов в приложение ✅
	startTraningCards: number // количество раз сколько было заходов на повторение карточек ✅
	activeDays: string[] // количество активных дней в месяце ✅
	totalTimeSpent: number // Время в секундах за месяц проведено в приложении ✅
	studiedCard: number // количество изученных карточек за месяц ✅
	repeatCard: number // количество повторений карточек за месяц ✅
}

export interface IActivityYear {
	// месяц
	[key: number]: IActivityMonth
}

export interface IUserActivity {
	year: {
		// 2025 и т.д.
		[key: number]: IActivityYear
	}
}

export interface IUser {
	name: string
	uid: string
	dateRegistration: Date
	showVariantList: null | ShowVariantList
	email: string
	languages: ILanguage[]
	native_language: ILanguage | null
	image: string
	activity?: IUserActivity
}

import type { YearInReviewSlideId } from "@shared/api/services/appConfig/types"

export const SLIDE_ID_LABELS: Record<YearInReviewSlideId, string> = {
	intro: "Вступление",
	cards_added: "Добавлено карточек",
	cards_learned: "Изучено карточек",
	practice_sessions: "Тренировки",
	streak: "Стрик",
	daily_tasks: "Ежедневные задания",
	app_opens: "Открытия приложения",
	cards_reviewed: "Повторено карточек",
	languages: "Языки",
	outro: "Заключение",
}

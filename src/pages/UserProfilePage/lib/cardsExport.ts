import {
	CARDS_EXPORT_FORMAT_VERSION,
	type CardsExportFile,
	type UserCard,
} from "@shared/api/services/cards/types"

/**
 * Скачивает JSON-файл с карточками в формате мобильного экспорта:
 * { version, exported_at, items } — такой файл принимает импорт карточек.
 */
export const downloadCardsExportFile = (items: UserCard[]) => {
	const exportedAt = new Date().toISOString()
	const file: CardsExportFile = {
		version: CARDS_EXPORT_FORMAT_VERSION,
		exported_at: exportedAt,
		items,
	}
	const blob = new Blob([JSON.stringify(file, null, 2)], {
		type: "application/json",
	})
	const url = URL.createObjectURL(blob)
	const link = document.createElement("a")
	link.href = url
	link.download = `word-cards-${exportedAt.replace(/[:.]/g, "-")}.json`
	document.body.appendChild(link)
	link.click()
	link.remove()
	URL.revokeObjectURL(url)
}

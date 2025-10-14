import { AppRoutes } from "@app/navigation/routes"
import Button from "@shared/Button/Button"
import { useAppNavigate } from "@shared/hooks/useAppNavigate"
import React from "react"

function AplicationPage() {
	const navigation = useAppNavigate()

	const toTranslation = () => {
		navigation(AppRoutes.translation)
	}

	return (
		<div>
			<Button onClick={toTranslation}>Переводы</Button>
		</div>
	)
}

export default AplicationPage

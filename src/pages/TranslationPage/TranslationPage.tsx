import React, { useEffect, useState } from "react"
import {
	getLanguageJson,
	JsonData,
	updateLanguageJson,
} from "./api/translationApi"
import { useAppSelector } from "@shared/hooks/useStore"
import Button from "@shared/Button/Button"
import { githubDarkTheme, JsonEditor } from "json-edit-react"
import Loading from "@shared/Loading/Loading"
import styles from "./TranslationPage.module.scss"
import Dropdown from "@shared/Dropdown/Dropdown"
import type { AppLanguageType } from "@shared/api/types"
import cn from "classnames"

function TranslationPage() {
	const [jsonData, setJsonData] = useState<JsonData | null>(null)
	const [loading, setLoading] = useState(false)
	const [isEdit, setIsEdit] = useState(false)
	const [isError, setIsError] = useState(false)

	const [language, setLanguage] = useState<AppLanguageType>()

	const firebaseApp = useAppSelector(store => store.app.firebaseApp)
	const options = firebaseApp ? Object.values(firebaseApp.appLanguages) : []

	const getJson = async (path: string) => {
		setLoading(true)
		setIsError(false)
		const res = await getLanguageJson(path)

		if (res && "json" in res) {
			setJsonData(res)
		} else {
			setIsError(true)
		}
		setLoading(false)
	}

	const saveJson = async () => {
		setIsError(false)
		if (jsonData && language && firebaseApp?.translations?.[language.code]) {
			setLoading(true)
			setIsEdit(false)

			const res = await updateLanguageJson(
				jsonData,
				firebaseApp.translations[language.code]
			)

			if ("content" in res && res?.content?.sha) {
				setJsonData(prev => {
					return {
						...prev!,
						sha: res.content.sha,
					}
				})
			} else {
				setLoading(true)
			}

			setLoading(false)
		}
	}

	useEffect(() => {
		if (firebaseApp && language) {
			getJson(firebaseApp.translations[language.code])
		}
	}, [firebaseApp, language])

	useEffect(() => {
		if (firebaseApp) {
			setLanguage(firebaseApp.appLanguages.ru)
		}
	}, [firebaseApp])

	return (
		<div>
			<div className={styles.json}>
				{loading && (
					<span className={styles.loader}>
						<Loading />
					</span>
				)}

				{!!jsonData && (
					<div
						className={cn(styles.editor, {
							[styles.error]: isError,
						})}
					>
						<span className={styles.fileName}>{language?.code + ".json"} </span>

						<JsonEditor
							showArrayIndices={false}
							showCollectionCount={false}
							theme={[githubDarkTheme]}
							data={jsonData.json}
							maxWidth={"100%"}
							minWidth={"100%"}
							className={styles.jsonEditor}
							setData={e => {
								setIsEdit(true)
								setJsonData(prev => {
									return {
										...prev!,
										json: e!,
									}
								})
							}}
							rootName=''
						/>

						<div className={styles.dropdown}>
							<Dropdown
								options={options}
								labelKey='nativeName'
								valueKey='code'
								selected={language}
								onSelect={setLanguage}
							/>
						</div>

						<span className={styles.language}>
							{language?.name}{" "}
							{isError && <span className={styles.error}>Error</span>}
						</span>
					</div>
				)}
			</div>

			{isEdit && (
				<Button className={styles.btn} onClick={saveJson}>
					сохранить
				</Button>
			)}
		</div>
	)
}

export default TranslationPage

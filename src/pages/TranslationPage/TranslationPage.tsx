import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
	createLanguageJson,
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
import { useAddKeyTranslateMutation } from "./api/JsonServices"

function TranslationPage() {
	const [jsonData, setJsonData] = useState<JsonData | null>(null)
	const [loading, setLoading] = useState(false)
	const [isEdit, setIsEdit] = useState(false)
	const [isError, setIsError] = useState(false)
	const [fileNotFound, setFileNotFound] = useState(false)

	const [addKeyTranslate] = useAddKeyTranslateMutation()

	const [language, setLanguage] = useState<AppLanguageType>()

	const firebaseApp = useAppSelector(store => store.app.firebaseApp)
	const options = useMemo(() => {
		return firebaseApp
			? Object.values(firebaseApp.appLanguages).sort((a, b) => a.id - b.id)
			: []
	}, [firebaseApp])

	const getJson = async (path: string) => {
		setLoading(true)
		setIsError(false)
		const res = await getLanguageJson(path)

		if (res && "json" in res) {
			setJsonData(res)
		} else {
			if (res.status === 404) {
				setFileNotFound(true)
			} else {
				setIsError(true)
			}
		}
		setLoading(false)
	}

	const onCreateJson = useCallback(async () => {
		if (!firebaseApp || !language) return

		setLoading(true)

		await createLanguageJson({}, `${language.code}.json`)
		setTimeout(async () => {
			await getJson(`${language.code}.json`)
			await addKeyTranslate({ langCode: language.code })
			setFileNotFound(false)
		}, 1000)
	}, [firebaseApp, language, addKeyTranslate])

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
		if (firebaseApp && !language) {
			setLanguage(firebaseApp.appLanguages.ru)
		}
	}, [firebaseApp, language])

	return (
		<div>
			<div className={styles.json}>
				{loading && (
					<span className={styles.loader}>
						<Loading />
					</span>
				)}

				{fileNotFound && (
					<h1 className={styles.fileNotFound}>
						Файл {language?.code + ".json"} не найден
					</h1>
				)}

				{fileNotFound && (
					<Button className={styles.btn} onClick={onCreateJson}>
						Создать файл {language?.code + ".json"}
					</Button>
				)}

				{!!jsonData && !fileNotFound && (
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
							{language?.nativeName}{" "}
							{isError && <span className={styles.error}>Error</span>}
						</span>
					</div>
				)}
			</div>

			{isEdit && !fileNotFound && (
				<Button className={styles.btn} onClick={saveJson}>
					сохранить
				</Button>
			)}
		</div>
	)
}

export default TranslationPage

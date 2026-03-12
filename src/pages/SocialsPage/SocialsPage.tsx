import React, {
	ChangeEvent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react"
import styles from "./SocialsPage.module.scss"
import type { ISocial, SocialKey, SocialKeys } from "@shared/api/types"
import SocialItem from "./ui/SocialItem/SocialItem"
import { useGetAppConfigQuery } from "@shared/api/services/appConfig/AppConfigQuery"
import { Icon } from "@assets/icons/Icon"
import PageHeader from "@shared/PageHeader/PageHeader"

type SocialsDataType = Record<SocialKey, ISocial>

function SocialsPage() {
	const { data } = useGetAppConfigQuery()

	const [socialsData, setSocialsData] = useState<SocialsDataType | null>(null)

	const inputs = useMemo(() => {
		return socialsData ? Object.values(socialsData) : []
	}, [socialsData])

	const onDelete = useCallback(
		(id: number) => {
			// const socials = socialsData
			// 	? Object.values(socialsData).filter(it => it.id !== id)
			// 	: []
			// if (socials.length) changeSocials({ socials })
		},
		[socialsData],
	)

	const onAdd = useCallback(() => {
		setSocialsData(prev => {
			return prev
				? {
						...prev,
						add: {
							id: 10,
							link: "",
							icon: "",
							name: "",
							key: "",
						},
					}
				: null
		})
	}, [])

	const onChangeInput = useCallback(
		(e: ChangeEvent<HTMLInputElement>, it: ISocial, fieldName: SocialKeys) => {
			setSocialsData(prev => {
				return prev
					? {
							...prev,
							[it.id === 10 ? "add" : it.key]: {
								...prev[it.id === 10 ? "add" : it.key],
								[fieldName]: e.target.value,
							},
						}
					: prev
			})
		},
		[],
	)

	const onSaveHandler = useCallback(() => {
		const newSocialsData = {
			...socialsData,
		}

		const add = newSocialsData["add"]

		if (add && add.key) {
			delete newSocialsData["add"]
			newSocialsData[add.key] = {
				...add,
				id: +new Date(),
			}
		}

		const socials = newSocialsData ? Object.values(newSocialsData) : []

		// if (socials.length) changeSocials({ socials })
	}, [socialsData])

	useEffect(() => {
		if (data?.socials) {
			const map: Partial<SocialsDataType> = {}
			data?.socials.forEach(it => {
				map[it.key] = it
			})
			setSocialsData(map as SocialsDataType)
		}
	}, [data])

	return (
		<div className={styles.page}>
			<PageHeader
				title='Social links'
				subtitle='Manage external profiles and store badges.'
			/>

			<div className={styles.card}>
				<div className={styles.inputs}>
					<h1 className={styles.cardTitle}>Социальные сети</h1>

					{inputs.map((it, i) => {
						const prevIt = data?.socials.find(item => item.id === it.id)
						return (
							<SocialItem
								key={it.id}
								index={i}
								item={it}
								prevIt={prevIt}
								isLoading={false}
								onChangeInput={onChangeInput}
								onDelete={onDelete}
								onSaveHandler={onSaveHandler}
							/>
						)
					})}
				</div>

				{!socialsData?.["add"] && (
					<div className={styles.addBtn}>
						<Icon
							kind='svg'
							name='add-square-green-64'
							width={20}
							height={20}
							onClick={onAdd}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default SocialsPage

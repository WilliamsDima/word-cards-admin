import React, {
	ChangeEvent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react"
import AddIcon from "@assets/icons/add-square-green-64.svg?react"
import styles from "./SocialsPage.module.scss"
import { useAppSelector } from "@shared/hooks/useStore"
import type { ISocial, SocialKey, SocialKeys } from "@shared/api/types"
import { useChangeSocialsMutation } from "@pages/AplicationPage/api/AppServices"
import SocialItem from "./ui/SocialItem/SocialItem"

type SocialsDataType = Record<SocialKey, ISocial>

function SocialsPage() {
	const { firebaseApp } = useAppSelector(store => store.app)

	const [socialsData, setSocialsData] = useState<SocialsDataType | null>(null)

	const [changeSocials, { isLoading }] = useChangeSocialsMutation()

	const inputs = useMemo(() => {
		return socialsData ? Object.values(socialsData) : []
	}, [socialsData])

	const onDelete = useCallback(
		(id: number) => {
			const socials = socialsData
				? Object.values(socialsData).filter(it => it.id !== id)
				: []

			if (socials.length) changeSocials({ socials })
		},
		[socialsData, changeSocials]
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
		[]
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

		if (socials.length) changeSocials({ socials })
	}, [changeSocials, socialsData])

	useEffect(() => {
		if (firebaseApp?.socials) {
			const map: Partial<SocialsDataType> = {}
			firebaseApp?.socials.forEach(it => {
				map[it.key] = it
			})
			setSocialsData(map as SocialsDataType)
		}
	}, [firebaseApp])

	return (
		<div>
			<div className={styles.inputs}>
				<h1 className={styles.title}>Социальные сети</h1>

				{inputs.map((it, i) => {
					const prevIt = firebaseApp?.socials.find(item => item.id === it.id)
					return (
						<SocialItem
							key={it.id}
							index={i}
							item={it}
							prevIt={prevIt}
							isLoading={isLoading}
							onChangeInput={onChangeInput}
							onDelete={onDelete}
							onSaveHandler={onSaveHandler}
						/>
					)
				})}
			</div>

			{!socialsData?.["add"] && (
				<div className={styles.addBtn}>
					<AddIcon onClick={onAdd} />
				</div>
			)}
		</div>
	)
}

export default SocialsPage

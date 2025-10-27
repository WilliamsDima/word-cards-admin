import React, {
	ChangeEvent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react"
import DoneIcon from "@assets/icons/done-green-48.svg?react"
import Loading from "@shared/Loading/Loading"
import DeleteIcon from "@assets/icons/delete-red-64.svg?react"
import AddIcon from "@assets/icons/add-square-green-64.svg?react"
import styles from "./SocialsPage.module.scss"
import { useAppSelector } from "@shared/hooks/useStore"
import type { ISocial, SocialKey, SocialKeys } from "@shared/api/types"
import { useChangeSocialsMutation } from "@pages/AplicationPage/api/AppServices"
import Input from "@shared/Input/Input"

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
						<div className={styles.group} key={it.id}>
							<div className={styles.groupNameBlock}>
								<DeleteIcon
									onClick={() => onDelete(it.id)}
									width={25}
									height={25}
								/>
								<p className={styles.index}>{i + 1}.</p>
								<p className={styles.blockName}>
									{it.id === 10 ? it.name : prevIt?.name}
								</p>
							</div>

							{it.id === 10 && (
								<>
									<p className={styles.blockName}>Key</p>

									<div className={styles.inputWrapper}>
										<Input
											value={it.key}
											onChange={e => onChangeInput(e, it, "key")}
										/>
										{prevIt && prevIt?.key !== it.key && (
											<DoneIcon
												onClick={onSaveHandler}
												width={28}
												height={28}
											/>
										)}
										{isLoading && <Loading className={styles.loader} />}
									</div>
								</>
							)}

							<p className={styles.blockName}>Name</p>

							<div className={styles.inputWrapper}>
								<Input
									value={it.name}
									onChange={e => onChangeInput(e, it, "name")}
								/>
								{prevIt && prevIt?.name !== it.name && (
									<DoneIcon onClick={onSaveHandler} width={28} height={28} />
								)}
								{isLoading && <Loading className={styles.loader} />}
							</div>

							<p className={styles.blockName}>icon</p>

							<div className={styles.inputWrapper}>
								<Input
									value={it.icon}
									onChange={e => onChangeInput(e, it, "icon")}
								/>
								{prevIt && prevIt?.icon !== it.icon && (
									<DoneIcon onClick={onSaveHandler} width={28} height={28} />
								)}
								{isLoading && <Loading className={styles.loader} />}
							</div>

							<p className={styles.blockName}>link</p>

							<div className={styles.inputWrapper}>
								<Input
									value={it.link}
									onChange={e => onChangeInput(e, it, "link")}
								/>
								{prevIt && prevIt?.link !== it.link && (
									<DoneIcon onClick={onSaveHandler} width={28} height={28} />
								)}
								{isLoading && <Loading className={styles.loader} />}
							</div>

							{it.id === 10 && (
								<span className={styles.save} onClick={onSaveHandler}>
									<DoneIcon width={28} height={28} />
									Добавить
								</span>
							)}
						</div>
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

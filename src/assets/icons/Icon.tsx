import type { ImgHTMLAttributes, SVGAttributes } from "react"
import AchievementIcon from "@assets/icons/svg/achievement.svg?react"
import AddSquareGreen64Icon from "@assets/icons/svg/add-square-green-64.svg?react"
import AddSquareWhiteIcon from "@assets/icons/svg/add-square-white.svg?react"
import AppIcon from "@assets/icons/svg/app.svg?react"
import ArrowChangeIcon from "@assets/icons/svg/arrow-change.svg?react"
import ArrowExpandLeftIcon from "@assets/icons/svg/arrow-expand-left.svg?react"
import ArrowExpandRightIcon from "@assets/icons/svg/arrow-expand-right.svg?react"
import CloseWhiteIcon from "@assets/icons/svg/close-white.svg?react"
import DeleteRed64Icon from "@assets/icons/svg/delete-red-64.svg?react"
import DoneGreen48Icon from "@assets/icons/svg/done-green-48.svg?react"
import DoneVIcon from "@assets/icons/svg/done-v.svg?react"
import EditIcon from "@assets/icons/svg/edit.svg?react"
import GooglePlayIconIcon from "@assets/icons/svg/google-play-icon.svg?react"
import GoogleIcon from "@assets/icons/svg/google.svg?react"
import LinksIcon from "@assets/icons/svg/links.svg?react"
import LogoutIcon from "@assets/icons/svg/logout.svg?react"
import QuestionCircleIcon from "@assets/icons/svg/question-circle.svg?react"
import SearchIcon from "@assets/icons/svg/search.svg?react"
import SupportIcon from "@assets/icons/svg/support.svg?react"
import TranslateIcon from "@assets/icons/svg/translate.svg?react"
import UserIcon from "@assets/icons/svg/user.svg?react"
import LogoWebp from "@assets/icons/webp/logo.webp"

export type SvgName =
	| "achievement"
	| "add-square-green-64"
	| "add-square-white"
	| "app"
	| "arrow-change"
	| "arrow-expand-left"
	| "arrow-expand-right"
	| "close-white"
	| "delete-red-64"
	| "done-green-48"
	| "done-v"
	| "edit"
	| "google-play-icon"
	| "google"
	| "links"
	| "logout"
	| "question-circle"
	| "search"
	| "support"
	| "translate"
	| "user"
export type WebpName = "logo"

type KindMap = {
	svg: {
		name: SvgName
	} & SVGAttributes<SVGSVGElement>
	webp: {
		name: WebpName
		width: number
		height: number
	} & ImgHTMLAttributes<HTMLImageElement>
}

export function Icon<K extends keyof KindMap>(props: { kind: K } & KindMap[K]) {
	if (props.kind === "webp") {
		const webpProps = props as { kind: "webp" } & KindMap["webp"]
		const { name, width, height, alt } = webpProps
		switch (name) {
			case "logo":
				return (
					<img
						src={LogoWebp}
						alt={alt ?? name}
						{...webpProps}
						width={width}
						height={height}
					/>
				)

			default:
				return <></>
		}
	}

	const svgProps = props as { kind: "svg" } & KindMap["svg"]
	const { name, width, height } = svgProps

	switch (name) {
		case "achievement":
			return <AchievementIcon width={width} height={height} {...svgProps} />

		case "add-square-green-64":
			return <AddSquareGreen64Icon width={width} height={height} {...svgProps} />

		case "add-square-white":
			return <AddSquareWhiteIcon width={width} height={height} {...svgProps} />

		case "app":
			return <AppIcon width={width} height={height} {...svgProps} />

		case "arrow-change":
			return <ArrowChangeIcon width={width} height={height} {...svgProps} />

		case "arrow-expand-left":
			return <ArrowExpandLeftIcon width={width} height={height} {...svgProps} />

		case "arrow-expand-right":
			return <ArrowExpandRightIcon width={width} height={height} {...svgProps} />

		case "close-white":
			return <CloseWhiteIcon width={width} height={height} {...svgProps} />

		case "delete-red-64":
			return <DeleteRed64Icon width={width} height={height} {...svgProps} />

		case "done-green-48":
			return <DoneGreen48Icon width={width} height={height} {...svgProps} />

		case "done-v":
			return <DoneVIcon width={width} height={height} {...svgProps} />

		case "edit":
			return <EditIcon width={width} height={height} {...svgProps} />

		case "google-play-icon":
			return <GooglePlayIconIcon width={width} height={height} {...svgProps} />

		case "google":
			return <GoogleIcon width={width} height={height} {...svgProps} />

		case "links":
			return <LinksIcon width={width} height={height} {...svgProps} />

		case "logout":
			return <LogoutIcon width={width} height={height} {...svgProps} />

		case "question-circle":
			return <QuestionCircleIcon width={width} height={height} {...svgProps} />

		case "search":
			return <SearchIcon width={width} height={height} {...svgProps} />

		case "support":
			return <SupportIcon width={width} height={height} {...svgProps} />

		case "translate":
			return <TranslateIcon width={width} height={height} {...svgProps} />

		case "user":
			return <UserIcon width={width} height={height} {...svgProps} />

		default:
			return <></>
	}
}

import { FC } from "react"
import AddSquareGreen64Icon from "@assets/icons/svg/add-square-green-64.svg?react"
import AppIcon from "@assets/icons/svg/app.svg?react"
import ArrowExpandLeftIcon from "@assets/icons/svg/arrow-expand-left.svg?react"
import ArrowExpandRightIcon from "@assets/icons/svg/arrow-expand-right.svg?react"
import DeleteRed64Icon from "@assets/icons/svg/delete-red-64.svg?react"
import DoneGreen48Icon from "@assets/icons/svg/done-green-48.svg?react"
import GooglePlayIconIcon from "@assets/icons/svg/google-play-icon.svg?react"
import GoogleIcon from "@assets/icons/svg/google.svg?react"
import LogoutIcon from "@assets/icons/svg/logout.svg?react"
import SearchIcon from "@assets/icons/svg/search.svg?react"
import SupportIcon from "@assets/icons/svg/support.svg?react"
import UserIcon from "@assets/icons/svg/user.svg?react"

export type SVGName = "add-square-green-64" | "app" | "arrow-expand-left" | "arrow-expand-right" | "delete-red-64" | "done-green-48" | "google-play-icon" | "google" | "logout" | "search" | "support" | "user"

export type IconProps = {
	name: SVGName
	width: number | string | undefined
	height: number | string | undefined
}

export const Icon: FC<IconProps> = ({ name, height, width }) => {
	switch (name) {
		case "add-square-green-64":
			return <AddSquareGreen64Icon width={width} height={height} />

		case "app":
			return <AppIcon width={width} height={height} />

		case "arrow-expand-left":
			return <ArrowExpandLeftIcon width={width} height={height} />

		case "arrow-expand-right":
			return <ArrowExpandRightIcon width={width} height={height} />

		case "delete-red-64":
			return <DeleteRed64Icon width={width} height={height} />

		case "done-green-48":
			return <DoneGreen48Icon width={width} height={height} />

		case "google-play-icon":
			return <GooglePlayIconIcon width={width} height={height} />

		case "google":
			return <GoogleIcon width={width} height={height} />

		case "logout":
			return <LogoutIcon width={width} height={height} />

		case "search":
			return <SearchIcon width={width} height={height} />

		case "support":
			return <SupportIcon width={width} height={height} />

		case "user":
			return <UserIcon width={width} height={height} />

		default:
			return <></>
	}
}

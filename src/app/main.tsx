import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.scss"
import App from "./App"
import { Provider } from "react-redux"
import { store } from "./store"
import { initFirebaseAuthTokenSync } from "@shared/config/firebaseAuth"
import { isPublicPath } from "./navigation/routes"
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill"
import countryFlagsFontUrl from "country-flag-emoji-polyfill/dist/TwemojiCountryFlags.woff2?url"

// Windows (Chrome/Edge) не рисует emoji-флаги и показывает вместо них буквы (RU, US...).
// Полифилл подключает шрифт с флагами только там, где их нет; шрифт берём из бандла, без CDN.
polyfillCountryFlagEmojis("Twemoji Country Flags", countryFlagsFontUrl)

// На публичных страницах (например, /download) Firebase-сессию не трогаем:
// подписка на токен для залогиненного админа дёрнула бы /users/sync.
if (!isPublicPath(window.location.pathname)) {
	initFirebaseAuthTokenSync()
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</StrictMode>,
)

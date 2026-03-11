import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.scss"
import App from "./App"
import { Provider } from "react-redux"
import { store } from "./store"
import { initFirebaseAuthTokenSync } from "@shared/config/firebaseAuth"

initFirebaseAuthTokenSync()

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</StrictMode>,
)

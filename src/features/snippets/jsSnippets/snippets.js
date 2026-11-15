import LocalStorage from "../../../localStorage/localStorage"
import { changeKeyBind } from "./jsSnippetsUtils"

// Ctrl + Space opens quick search (Spotify's Ctrl + K)
export function toggleQuickSearchKeyBind() {
    changeKeyBind("mod+space", "k", LocalStorage.config.quickSearch)
}

// Ctrl + / focuses search (Spotify's Ctrl + L)
export function toggleSearchPageKeyBind() {
    changeKeyBind("mod+/", "l", LocalStorage.config.search)
}

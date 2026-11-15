import Popup from "../ui/Popup/Popup"
import LocalStorage from "../localStorage/localStorage"
import Api from "../services/api"
import Utils from "../utils/utils"

const Backup = (() => {
    const pendingNotificationKey = "nord:pendingNotification"

    // A restore reloads the app half a second later, which used to wipe the success message before
    // it could be read. Keep it across the reload and show it once Nord has started again.
    function showPendingNotification() {
        const message = LocalStorage.utils.get(pendingNotificationKey)
        if (!message) return

        localStorage.removeItem(pendingNotificationKey)
        Api.send.notification(message, false, 4000)
    }

    function importData(data, mode = undefined) {
        if (data.hideHomePageRecommendation !== undefined && mode === undefined) {
            LocalStorage.saveConfig(data)

            LocalStorage.utils.set(pendingNotificationKey, "Nord settings restored successfully")
        } else if (
            // chosen explicitly from a full backup: any set of positions is valid, including an empty one
            (mode === "banner" && data && typeof data === "object" && !Array.isArray(data)) ||
            // a banner-only backup, recognised by the entry every default config ships with
            data["a:5YDSZWizEYBsXgk6kwxvMn"] !== undefined ||
            data["spotify:album:5YDSZWizEYBsXgk6kwxvMn"] !== undefined
        ) {
            LocalStorage.saveConfig("bannerPosition", data)

            LocalStorage.utils.set(pendingNotificationKey, "Banner positions restored successfully")
        } else {
            Api.send.notification("Failed to Restore, backup data seems to be Corrupted!", true, 4000)
            return
        }

        setTimeout(() => {
            Utils.utils.forceReload()
        }, 500)
    }

    async function importSettings(mode) {
        try {
            const data = await Utils.json.stringToJSON(mode === "file" ? await filePicker() : await Api.clipboard.get())

            if (data.hideHomePageRecommendation !== undefined) {
                Popup.createMiniPopup({
                    title: "Restore Settings",
                    body: "what to Restore?",
                    buttonName1: "banner",
                    buttonName2: "all",
                    onClickHandler1: () => importData(data.bannerPosition, "banner"),
                    onClickHandler2: () => importData(data),
                })
            } else {
                importData(data)
            }
        } catch (err) {
            const errorMessage = "Failed to Restore, backup data seems to be Corrupted"

            console.warn(`Nord:handled: ${errorMessage} > from: \`importSettings()\` > error: ${err}`)
            Api.send.notification(errorMessage, true, 4000)
        }
    }

    function exportSettings(mode) {
        switch (mode) {
            case "all":
                Api.clipboard.send(Utils.json.JSONToString(LocalStorage.config))
                break
            case "banners":
                Api.clipboard.send(Utils.json.JSONToString(LocalStorage.config.bannerPosition))
                break
        }
        Api.send.notification("Export Data Copied to Clipboard")
    }

    async function filePicker() {
        const fileHandle = await window.showOpenFilePicker()
        const file = await fileHandle[0].getFile()
        const text = await file.text()

        return text
    }

    return {
        import: importSettings,
        export: exportSettings,
        showPendingNotification: showPendingNotification,
        utils: {
            filePicker: filePicker,
        },
    }
})()

export default Backup

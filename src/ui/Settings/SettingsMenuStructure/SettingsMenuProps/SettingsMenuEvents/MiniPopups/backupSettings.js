import Backup from "../../../../../../backup/backup"
import Popup from "../../../../../Popup/Popup"

// second step: where the backup goes (mirrors "Restore from?")
function backupTargetMiniPopup(mode) {
    Popup.createMiniPopup({
        title: "Backup Settings",
        body: "Backup to?",
        buttonName1: "Clipboard",
        buttonName2: "File",
        onClickHandler1: () => Backup.export(mode, "clipboard"),
        onClickHandler2: () => Backup.export(mode, "file"),
    })
}

export default function backupSettingsMiniPopup() {
    Popup.createMiniPopup({
        title: "Backup Settings",
        body: "What to backup?",
        buttonName1: "Banner Positions",
        buttonName2: "All Settings",
        // wait for this popup to close before opening the next one
        onClickHandler1: () => setTimeout(() => backupTargetMiniPopup("banners"), 0),
        onClickHandler2: () => setTimeout(() => backupTargetMiniPopup("all"), 0),
    })
}

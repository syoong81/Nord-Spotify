import backupSettingsMiniPopup from "./SettingsMenuEvents/MiniPopups/backupSettings"
import resetSettingsMiniPopup from "./SettingsMenuEvents/MiniPopups/resetSettings"
import restoreSettingsMiniPopup from "./SettingsMenuEvents/MiniPopups/restoreSettings"

export default function getSettingsMenuButtonProps() {
    return {
        likeNord: {
            name: "Like on GitHub 👍",
            color: "green",
            onClickHandler: () => window.open("https://github.com/syoong81/Nord-Spotify"),
        },
        reset: {
            name: "Reset Settings",
            color: "red",
            onClickHandler: resetSettingsMiniPopup,
        },
        backup: {
            name: "Backup",
            onClickHandler: backupSettingsMiniPopup,
        },
        restore: {
            name: "Restore",
            onClickHandler: restoreSettingsMiniPopup,
        },
    }
}

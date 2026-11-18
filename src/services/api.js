const Api = (() => {
    // "sp://desktop/v1/version" no longer resolves on current Spotify, so read the OS from the client itself
    async function getOS() {
        const classList = document.documentElement.classList
        if (classList.contains("spotify__os--is-windows")) return "Windows"
        if (classList.contains("spotify__os--is-macos")) return "Mac"
        if (classList.contains("spotify__os--is-linux")) return "Linux"

        const userAgent = navigator.userAgent
        if (userAgent.includes("Windows")) return "Windows"
        if (userAgent.includes("Mac")) return "Mac"
        return "Linux"
    }

    function getFromClipboard() {
        return Spicetify.Platform.ClipboardAPI.paste()
    }

    function sendToClipboard(data) {
        if (data) {
            Spicetify.Platform.ClipboardAPI.copy(data)
        }
    }

    function notification(text, isError = false, ms) {
        Spicetify.showNotification(text, isError, ms)
    }

    return {
        get: {
            os: getOS,
        },
        send: {
            notification: notification,
        },
        clipboard: {
            get: getFromClipboard,
            send: sendToClipboard,
        },
    }
})()

export default Api

import PreloadUtils from "./preloadUtils"

export default async function preload() {
    window.Nord = window.Nord ?? {}
    window.Nord.shared = window.Nord.shared ?? {}
    window.Nord.shared.extensionList = window.Nord.shared.extensionList ?? {}

    // installed extensions
    window.Nord.shared.extensionList.beautifulLyrics = await PreloadUtils.checkIfAnExtensionIsInstalled("beautiful-lyrics")
}

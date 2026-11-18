import LocalStorage from "../localStorage/localStorage"
import Utils from "../utils/utils"
import stateUtils from "./stateUtils"

const State = (() => {
    const AppState = {
        path: undefined,
        isBannerPage: undefined,
        isValidBannerPage: undefined,
        pageType: undefined,
        uri: undefined,
        uid: undefined,
        image: undefined,
        previousUri: undefined,
        islocal: undefined,
        filterCSS: undefined,
        shouldChangeProp: false,
        changeStateSrc: "init",
        isZoomOutKeyPressed: false,
        currentPos: undefined,
        dynamicColorPalette: {},
    }

    async function init() {
        while (!(Utils.player.getTrack() && Spicetify.Platform.History.location)) {
            await new Promise((resolve) => setTimeout(resolve, 10))
        }

        AppState.path = Spicetify.Platform.History.location.pathname
        const track = Utils.player.getTrack()

        AppState.uri = track.uri
        AppState.uid = Utils.path.uriToUID(AppState.uri)
        AppState.pageType = stateUtils.pathToType()
        AppState.islocal = Utils.player.isLocalTrack(track)
        AppState.image = track.metadata.image_xlarge_url
        AppState.filterCSS = LocalStorage.config.bannerBlurValue == 0 ? "unset" : `blur(${LocalStorage.config.bannerBlurValue}px)`

        stateUtils.updateDomClasses()
    }

    function onPageChange(event) {
        AppState.changeStateSrc = "pagechange"
        AppState.path = event.pathname
        AppState.pageType = stateUtils.pathToType()

        stateUtils.updateDomClasses()
    }

    function onSongChange(event) {
        AppState.changeStateSrc = "songchange"
        AppState.islocal = Utils.player.isLocalTrack(Utils.player.getTrack(event.data))
    }

    return {
        app: AppState,
        init: init,
        onPageChange: onPageChange,
        onSongChange: onSongChange,
    }
})()

export default State

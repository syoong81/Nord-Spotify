import State from "../../state/state"
import LocalStorage from "../../localStorage/localStorage"
import Utils from "../../utils/utils"
import conditionalSnippets from "../snippets/externalCssSnippets/conditionalSnippets"
import Snippet from "../snippets/snippets"

export async function injectAndStyleBanners() {
    let mainView = await Utils.dom.waitForElement(".under-main-view, .Root__main-view", 1000)

    // Spotify removed its own `.under-main-view` layer, and everything inside `.main-view-container`
    // is re-rendered on navigation, so the banner gets its own layer directly under the main view
    if (!mainView.classList.contains("under-main-view")) {
        const bannerLayer = document.createElement("div")
        bannerLayer.className = "under-main-view nord-banner-layer"
        mainView.prepend(bannerLayer)
        mainView = bannerLayer
    }

    // inject main banner
    const banner = document.createElement("div")
    banner.id = "main-banner"
    mainView.appendChild(banner)

    // inject preload banner
    const preBanner = document.createElement("img")
    preBanner.id = "preload-banner"
    preBanner.style.display = "none"
    mainView.appendChild(preBanner)

    // inject banner css
    Snippet.utils.injectConditionedClass(conditionalSnippets.bannerCSS)

    LocalStorage.config.fitBannerImage ? (banner.style.backgroundSize = "contain") : (banner.style.backgroundSize = "cover")

    return banner
}

export async function injectBanner(rawData = Spicetify.Player) {
    if (State.app.changeStateSrc !== "songchange") {
        hideOrShowBanner()
        fixBannerPage()
    }

    await updateState(rawData)
    if (State.app.shouldChangeProp) updateBannerImage()
    saveBannerPos()
}

function saveBannerPos() {
    LocalStorage.saveConfig("bannerPosition", LocalStorage.config.bannerPosition)
}

export function updateBannerPosInConfig() {
    const smallUri = Utils.utils.makeSmallUri(State.app.uri)

    if (State.app.currentPos == 50) {
        delete LocalStorage.config.bannerPosition[smallUri]
    } else {
        LocalStorage.config.bannerPosition[smallUri] = `${State.app.currentPos}`
    }
}

function updateBannerImage() {
    const banner = document.querySelector("#main-banner")
    const preBanner = document.querySelector("#preload-banner")

    // return if banner image didn't change
    if (banner.style.backgroundImage == `url("${State.app.image}")`) {
        return
    }

    preBanner.src = State.app.image
    preBanner.addEventListener("load", changeBannerImage)

    function changeBannerImage() {
        setTimeout(
            () => {
                banner.style.filter = "blur(100px)"
                const smallUri = Utils.utils.makeSmallUri(State.app.uri)
                setTimeout(() => {
                    banner.style.backgroundImage = `url("${State.app.image}")`
                    const pos = LocalStorage.config.bannerPosition.hasOwnProperty(smallUri) ? LocalStorage.config.bannerPosition[smallUri] : "50"
                    banner.style.backgroundPositionY = pos + "%"
                    banner.style.filter = State.app.filterCSS
                    preBanner.removeEventListener("load", changeBannerImage)
                }, 500)
            },
            State.app.changeStateSrc === "songchange" ? 0 : 100 // song images are already loaded by spotify so no need wait 100ms for loading
        )
    }
}

function handleSpotifyDefaultBanner() {
    if (State.app.pageType === "artists" || State.app.pageType === "playlists") {
        const spotifyDefaultBanner = document.querySelector(".main-entityHeader-background")

        if (spotifyDefaultBanner && State.app.changeStateSrc === "songchange") {
            spotifyDefaultBanner.style.display = "none"
        }
    }
}

async function updateState(rawData) {
    if (!LocalStorage.config.changeCoverArtOnSongChange && State.app.isBannerPage && State.app.changeStateSrc === "songchange") {
        return
    }

    handleSpotifyDefaultBanner()

    if (State.app.changeStateSrc === "songchange" || !State.app.isBannerPage || LocalStorage.config.songBannersOnly) {
        if (State.app.islocal) {
            State.app.uri = Utils.player.getTrack(rawData.data).uri
        } else {
            State.app.uri = Utils.player.getTrack(rawData.data).metadata.album_uri
        }

        State.app.uid = Utils.path.uriToUID(State.app.uri) // this wrapped inside a try catch block. idk why

        if (State.app.previousUri == State.app.uri) {
            State.app.shouldChangeProp = false
            return
        }
        State.app.previousUri = State.app.uri
        State.app.shouldChangeProp = true

        State.app.image = Utils.player.getTrack(rawData.data).metadata.image_xlarge_url
    } else if (State.app.isBannerPage) {
        State.app.uri = Utils.path.pathToURI(State.app.path)
        State.app.uid = Utils.path.pathToUID(State.app.path)

        if (State.app.previousUri == State.app.uri) {
            State.app.shouldChangeProp = false
            return
        }
        State.app.previousUri = State.app.uri
        State.app.shouldChangeProp = true

        State.app.image = await fetchBannerImage(rawData)

        if (!State.app.image) State.app.shouldChangeProp = false
    }
}

function largestImage(sources = []) {
    const size = (source) => source.width ?? source.maxWidth ?? 0
    return [...sources].sort((a, b) => size(b) - size(a))[0]?.url
}

// The web API (api.spotify.com) now rejects requests made from the client, so page images come from Spotify's GraphQL API
async function fetchPageImage() {
    const { Request, Definitions } = Spicetify.GraphQL
    const uri = State.app.uri
    let response

    switch (State.app.pageType) {
        case "albums":
            response = await Request(Definitions.getAlbum, { uri: uri, locale: "", offset: 0, limit: 1 })
            return largestImage(response.data.albumUnion.coverArt.sources)
        case "artists":
            response = await Request(Definitions.queryArtistOverview, { uri: uri, locale: "", includePrerelease: false })
            return largestImage(response.data.artistUnion.visuals.avatarImage.sources)
        case "shows":
            response = await Request(Definitions.fetchExtractedColorAndImageForPodcastEntity, { uri: uri })
            return largestImage(response.data.podcastUnionV2.coverArt.sources)
        case "episodes":
            response = await Request(Definitions.fetchExtractedColorAndImageForEpisodeEntity, { uri: uri })
            return largestImage(response.data.episodeUnionV2.coverArt.sources)
    }
}

async function fetchBannerImage(rawData = Spicetify.Player) {
    try {
        if (!State.app.isBannerPage) {
            return Utils.player.getTrack(rawData.data).metadata.image_xlarge_url
        }

        if (State.app.pageType == "playlists") {
            const metadata = await Spicetify.Platform.PlaylistAPI.getMetadata(`spotify:playlist:${State.app.uid}`)
            return metadata.images[metadata.images.length - 1]?.url
        }

        return await fetchPageImage()
    } catch (err) {
        console.error(`Nord:unexpected: Can't fetch banner image > from: \`fetchBannerImage()\` > error: ${err}`)
    }
}

export function updateBannerBlur(value, src) {
    const banner = document.querySelector("#main-banner")

    value === "" ? (value = 0) : null

    if (src === "menu") {
        LocalStorage.config["bannerBlurValue"] = value
        LocalStorage.saveConfig("bannerBlurValue", LocalStorage.config["bannerBlurValue"])
    }

    State.app.filterCSS = value != 0 && (LocalStorage.config.bannerBlur || src === "lyrics") ? `blur(${value}px)` : "unset"
    banner.style.filter = State.app.filterCSS
}

export function hideOrShowLyricsPageBanners() {
    if ((State.app.pageType == "lyrics-plus" || State.app.pageType == "lyrics") && LocalStorage.config.bannersInLyricsPage) {
        State.app.pageType == "lyrics-plus" ? Utils.dom.injectCSS(conditionalSnippets.lyricsPlusNoBg, "lyricsPlusNoBg") : null
        updateBannerBlur(20, "lyrics")
    } else {
        updateBannerBlur(LocalStorage.config.bannerBlurValue)
        Utils.dom.removeInjectedElement("lyricsPlusNoBg")
    }
}

function fixBannerPage() {
    const fixPages = {
        albums: "fixAlbumPage",
        playlists: "fixEnhancedPage",
        liked: "fixLikedSongsPage",
        folder: "fixFolderPage",
        shows: "fixShowsPage",
        episodes: "fixEpisodesPage",
        local: "fixLocalPage",
    }

    const currentPage = fixPages[State.app.pageType]
    const otherPages = Object.values(fixPages).filter((className) => className !== currentPage)

    if (currentPage) Snippet.utils.injectConditionedClass(currentPage)
    otherPages.forEach((className) => Snippet.utils.injectConditionedClass(className, false))
}

export function hideOrShowBanner() {
    const banner = document.querySelector("#main-banner")

    if (
        State.app.isValidBannerPage &&
        LocalStorage.config.showBanner &&
        !(window.Nord.shared.extensionList.beautifulLyrics && (State.app.pageType === "lyrics" || State.app.pageType === "lyrics-plus"))
    ) {
        hideOrShowLyricsPageBanners()
        if (LocalStorage.config.fullPageBanner) {
            Snippet.utils.injectConditionedClass(conditionalSnippets.bigBannerLibX)
        }
        Snippet.utils.injectConditionedClass(conditionalSnippets.hidePageDetails, LocalStorage.config.hidePageDetails)
        banner.style.display = "unset"
    } else {
        Snippet.utils.injectConditionedClass(conditionalSnippets.bigBannerLibX, false)
        Snippet.utils.injectConditionedClass(conditionalSnippets.hidePageDetails, false)
        banner.style.display = "none"
    }
}

export function canBannerInteractWithPlayerBar() {
    return !(
        document.querySelector(".main-nowPlayingBar-left a:hover") ||
        document.querySelector(".main-nowPlayingBar-left span:hover") ||
        document.querySelector(".main-nowPlayingBar-left img:hover") ||
        document.querySelector(".main-nowPlayingBar-left svg:hover") ||
        document.querySelector(".main-nowPlayingBar-left button:hover") ||
        document.querySelector(".main-nowPlayingBar-right button:hover") ||
        document.querySelector(".main-nowPlayingBar-right svg:hover") ||
        document.querySelector(".volume-bar:hover")
    )
}

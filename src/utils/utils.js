import Api from "../services/api"
import LocalStorage from "../localStorage/localStorage"

const Utils = (() => {
    function pathToURI(path) {
        path = path.split("/")
        return `spotify:${path[1]}:${path[2]}`
    }

    function pathToUID(path) {
        return path.split("/")[2]
    }

    function uriToUID(uri) {
        return uri.split(":")[2]
    }

    async function waitForElement(selector, timeout = null, location = document.body) {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector))
            }

            const observer = new MutationObserver(async () => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector))
                    observer.disconnect()
                } else {
                    if (timeout) {
                        async function timeOver() {
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    observer.disconnect()
                                    resolve(false)
                                }, timeout)
                            })
                        }
                        resolve(await timeOver())
                    }
                }
            })

            observer.observe(location, {
                childList: true,
                subtree: true,
            })
        })
    }

    async function waitForElementDeath(selector, location = document.body) {
        return new Promise((resolve) => {
            const observer = new MutationObserver(async () => {
                if (!document.querySelector(selector)) {
                    resolve(true)
                    observer.disconnect()
                }
            })

            observer.observe(location, {
                childList: true,
                subtree: true,
            })
        })
    }

    async function checkOS(os) {
        const platform = await Api.get.os()
        return platform.includes(os)
    }

    // Spicetify.ReactDOM is not available yet when the bundle is first evaluated,
    // so it has to be looked up at call time rather than imported from "react-dom"
    function renderReact(element, container) {
        const ReactDOM = Spicetify.ReactDOM
        if (ReactDOM.createRoot) {
            ReactDOM.createRoot(container).render(element)
        } else {
            ReactDOM.render(element, container)
        }
    }

    // Spotify renamed `Player.data.track` to `Player.data.item`
    function getTrack(data = Spicetify.Player.data) {
        return data?.item ?? data?.track
    }

    function isLocalTrack(track) {
        return track?.isLocal ?? track?.metadata?.is_local === "true"
    }

    function injectCSS(cssStyle, id) {
        id = `nord-${id}`
        if (!document.body.classList.contains(id)) {
            const styleElement = document.createElement("style")
            styleElement.id = id
            styleElement.innerHTML = cssStyle
            document.body.appendChild(styleElement)
            document.body.classList.add(id)
        }
    }

    function removeInjectedElement(id) {
        id = `nord-${id}`
        const element = document.getElementById(id)
        if (document.body.classList.contains(id) && element) {
            element.remove()
            document.body.classList.remove(id)
        }
    }

    function forceReload() {
        // hide() throws when no popup is open on current Spotify, which used to abort the reload
        try {
            Spicetify.PopupModal.hide()
        } catch (err) {
            // no popup to close
        }
        location.reload()
    }

    // unused
    function injectStyleSheet(src, id) {
        if (!document.body.classList.contains(id)) {
            let styleSheet = document.createElement("link")
            styleSheet.id = id
            styleSheet.rel = "stylesheet"
            styleSheet.type = "text/css"
            styleSheet.href = src
            document.body.appendChild(styleSheet)
            document.body.classList.add(id)
        }
    }

    // unused
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    // unused
    function camalize(str) {
        return capitalizeFirstLetter(str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()))
    }

    function JSONToString(data) {
        return JSON.stringify(data)
    }

    function stringToJSON(data) {
        return JSON.parse(data)
    }

    function makeSmallUri(uri) {
        const [type, uid] = uri.match(/^([^:]*:[^:]*):(.*)$/).slice(1, 3)
        switch (type) {
            case "spotify:album":
                return `a:${uid}`
            case "spotify:local":
                return `l:${uid}`
            case "spotify:playlist":
                return `p:${uid}`
            case "spotify:show":
                return `s:${uid}`
            case "spotify:artist":
                return `ar:${uid}`
            default:
                return uri
        }
    }

    function makeFullUri(smallUri) {
        const [type, uid] = smallUri.match(/^([^:]*):(.*)$/).slice(1, 3)
        switch (type) {
            case "a":
                return `spotify:album:${uid}`
            case "l":
                return `spotify:local:${uid}`
            case "p":
                return `spotify:playlist:${uid}`
            case "s":
                return `spotify:show:${uid}`
            case "ar":
                return `spotify:artist:${uid}`
            default:
                return smallUri
        }
    }

    function unColorLyricsPlus() {
        LocalStorage.utils.set("lyrics-plus:visual:colorful", "false")
        LocalStorage.utils.set("lyrics-plus:visual:noise", "false")
    }

    return {
        path: { pathToURI: pathToURI, pathToUID: pathToUID, uriToUID: uriToUID },
        dom: {
            waitForElement: waitForElement,
            waitForElementDeath: waitForElementDeath,
            injectCSS: injectCSS,
            renderReact: renderReact,
            removeInjectedElement: removeInjectedElement,
            injectStyleSheet: injectStyleSheet, // not used
        },
        api: { checkOS: checkOS },
        player: { getTrack: getTrack, isLocalTrack: isLocalTrack },
        utils: {
            forceReload: forceReload,
            capitalizeFirstLetter: capitalizeFirstLetter, // not used
            camalize: camalize,
            makeSmallUri: makeSmallUri,
            makeFullUri: makeFullUri, // not used
            unColorLyricsPlus: unColorLyricsPlus,
        },
        json: { JSONToString: JSONToString, stringToJSON: stringToJSON },
    }
})()

export default Utils

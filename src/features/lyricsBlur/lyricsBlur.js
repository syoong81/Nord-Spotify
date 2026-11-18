import Utils from "../../utils/utils"

// Blurs every line of Spotify's synced lyrics except the one being sung.
// The lines only carry generated class names, so the class marking the active line is learned from the live page:
// the theme makes passed and upcoming lines translucent, which leaves the active line as the only opaque one.
const LyricsBlur = (() => {
    const root = "[style*=\"--lyrics-color-active\"]"
    let timer = null

    function findActiveClass() {
        const lines = [...document.querySelectorAll(`${root} div[dir]`)]
        const opaque = lines.filter((line) => line.textContent.trim() && !getComputedStyle(line).color.startsWith("rgba"))
        if (opaque.length !== 1 || lines.length < 3) return null

        const others = lines.filter((line) => line !== opaque[0])
        return [...opaque[0].classList].find((name) => !others.some((line) => line.classList.contains(name))) || null
    }

    function learn() {
        const activeClass = findActiveClass()
        if (!activeClass) return

        clearInterval(timer)
        const active = `div[dir].${CSS.escape(activeClass)}`
        // :has() keeps unsynced lyrics, which never have an active line, readable
        Utils.dom.injectCSS(`${root}:has(${active}) div[dir]:not(.${CSS.escape(activeClass)}, :hover) { filter: blur(2px); }`, "lyricsBlurCSS")
    }

    function init() {
        timer = setInterval(learn, 1000)
    }

    return { init: init }
})()

export default LyricsBlur

import LocalStorage from "../../../../localStorage/localStorage"

export function customFont(url = LocalStorage.config.customFontURL, name = LocalStorage.config.customFontName) {
    return `
    /* Custom Font */
    @import url("${url}");
    a, abbr, address, article, aside, b, bdi, bdo, blockquote, button, caption, cite, code, data, dd, del, dfn, div, em, figcaption, figure, footer, h1, h2, h3, h4, h5, h6, header, i, ins, kbd, label, legend, li, main, mark, nav, ol, p, pre, q, s, samp, section, small, span, strong, sub, sup, table, tbody, td, tfoot, th, thead, time, tr, u, ul, var {
        font-family: "${name}", sans-serif, serif !important;
    }`
}

export function fontSize(size = LocalStorage.config.fontSize) {
    return `
    :root {
        font-size: ${size};
    }`
}

// track list backgrounds over the full page banner (the solid default lives in _conditional-snippets.scss)
export const trackListBgSelector = [
    ".playlist-playlist-playlistContent",
    "section[data-testid=\"playlist-page\"] > .contentSpacing:has(.main-trackList-trackListContainer)",
    "section[data-testid=\"album-page\"] > .contentSpacing:has(.main-trackList-trackListContainer)",
].join(", ")

export function bannerBehindTrackList(opacity = LocalStorage.config.trackListBgOpacity) {
    const value = Math.min(100, Math.max(0, parseFloat(opacity) || 0)) / 100
    return `
    body.nord-bannerCSS:not(:has(#main-banner[style*="display: none"])) :is(${trackListBgSelector}) {
        background-color: rgba(var(--spice-rgb-main), ${value}) !important;
    }`
}

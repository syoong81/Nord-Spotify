import LocalStorage from "../../../../localStorage/localStorage"
import Utils from "../../../../utils/utils"
import { bannerBehindTrackList, customFont, fontSize } from "./snippets"

// snippet injection is automated in -> src/features/snippets/snippets.js
// css is generated dynamically

const dynamicallyGeneratedCss = (() => {
    const snippets = {
        customFont: customFont,
        fontSizeBool: fontSize,
        bannerBehindTrackList: bannerBehindTrackList,
    }

    function toggleDynamicGeneratedCssSnippets(id) {
        if (LocalStorage.config[id]) {
            Utils.dom.injectCSS(snippets[id](), id)
        } else {
            Utils.dom.removeInjectedElement(id)
        }
    }

    return {
        snippets: snippets,
        utils: {
            toggle: toggleDynamicGeneratedCssSnippets,
        },
    }
})()

export default dynamicallyGeneratedCss

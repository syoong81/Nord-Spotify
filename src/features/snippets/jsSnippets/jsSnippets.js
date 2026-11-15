import { toggleQuickSearchKeyBind, toggleSearchPageKeyBind } from "./snippets"

const JsSnippets = (() => {
    const snippets = {
        quickSearch: toggleQuickSearchKeyBind,
        search: toggleSearchPageKeyBind,
    }

    function runJsSnippetCode(callback = () => {}) {
        callback()
    }

    return {
        snippets: snippets,
        utils: {
            toggle: runJsSnippetCode,
        },
    }
})()

export default JsSnippets

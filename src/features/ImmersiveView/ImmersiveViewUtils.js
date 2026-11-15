import Utils from "../../utils/utils"
import conditionalSnippets from "../snippets/externalCssSnippets/conditionalSnippets"
import Snippet from "../snippets/snippets"

const ImmersiveViewUtils = (() => {
    async function createReactPortal() {
        const portal = document.createElement("div")
        portal.className = "tetrax-react-portal main-topBar-historyButtons main-globalNav-historyButtons"

        const portalLocation = await Utils.dom.waitForElement(".main-noConnection, .main-globalNav-historyButtons")

        portalLocation.insertAdjacentElement("afterend", portal)

        return portal
    }

    function turnOnImmersiveView() {
        Snippet.utils.injectClass(conditionalSnippets.immersiveView)
        Snippet.utils.injectConditionedClass(conditionalSnippets.bigBannerLibXImmersiveView)
    }

    function turnOffImmersiveView() {
        Snippet.utils.removeClass(conditionalSnippets.immersiveView)
        Snippet.utils.injectConditionedClass(conditionalSnippets.bigBannerLibXImmersiveView, false)
    }

    return {
        createReactPortal: createReactPortal,
        turnOn: turnOnImmersiveView,
        turnOff: turnOffImmersiveView,
    }
})()

export default ImmersiveViewUtils

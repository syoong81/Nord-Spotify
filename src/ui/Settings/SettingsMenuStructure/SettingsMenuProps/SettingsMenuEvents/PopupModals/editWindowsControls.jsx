import React from "../../../../../../shims/react"

import Render from "../../../../../../components/Render/Render"
import Popup from "../../../../../Popup/Popup"
import LocalStorage from "../../../../../../localStorage/localStorage"
import dynamicallyGeneratedConditionalCss from "../../../../../../features/snippets/dynamicallyGeneratedSnippets/dynamicallyGeneratedConditionalCss/dynamicallyGeneratedConditionalCss"
import HideWindowsControls from "../../../../../../features/hideWindowsControls/hideWindowsControls"
import Utils from "../../../../../../utils/utils"

export default function editWindowsControlsPopup() {
    const TextProps = [
        ["Para", "1. First Edit Height and Width, values can also be in decimal"],
        ["Para", "2. After the Height and Width are perfect, Now try adjusting Filter"],
        ["Para", "Note: You can use decimals to be precise"],
    ]

    const InputProps = {
        height: {
            name: "Height",
            value: LocalStorage.tempConfig.hideWindowsControlsValues["height"],
            onChangeHandler: (value) => HideWindowsControls.event.update("height", value),
        },
        width: {
            name: "Width",
            value: LocalStorage.tempConfig.hideWindowsControlsValues["width"],
            onChangeHandler: (value) => HideWindowsControls.event.update("width", value),
        },
        filter: {
            name: "Filter",
            info: "Adjusts brightness",
            value: LocalStorage.tempConfig.hideWindowsControlsValues["filter"],
            onChangeHandler: (value) => HideWindowsControls.event.update("filter", value),
        },
    }

    function updateWindowsControls() {
        dynamicallyGeneratedConditionalCss.utils.inject("hideWindowsControlsCSS", false)
        dynamicallyGeneratedConditionalCss.utils.inject("hideWindowsControlsCSS", LocalStorage.config.hideWindowsControls)
    }

    function resetHideWindowsControlsValues() {
        LocalStorage.tempConfig.hideWindowsControlsValues = structuredClone(LocalStorage.defaultConfig.hideWindowsControlsValues)
        LocalStorage.saveConfig("hideWindowsControlsValues", structuredClone(LocalStorage.defaultConfig.hideWindowsControlsValues))
        updateWindowsControls()
    }

    function saveHideWindowsControlsValues() {
        LocalStorage.saveConfig("hideWindowsControlsValues", structuredClone(LocalStorage.tempConfig.hideWindowsControlsValues))
        updateWindowsControls()
    }

    const ButtonProps = {
        reset: {
            name: "Reset",
            color: "red",
            onClickHandler: resetHideWindowsControlsValues,
        },
        save: {
            name: "Save",
            onClickHandler: saveHideWindowsControlsValues,
        },
    }

    const editWindowsControlsStructure = [
        ["Heading", { name: "Tutorial" }],
        ["Text", TextProps],
        ["Divider"],
        ["Input", InputProps.height],
        ["Input", InputProps.width],
        ["Input", InputProps.filter],
        ["Space"],
        ["Button", ButtonProps.reset],
        ["Button", ButtonProps.save],
    ]

    Popup.createSubModal({
        title: "Edit Windows Controls",
        content: () => {
            /* eslint-disable react/no-unknown-property */
            return (
                <>
                    <div className="tetrax-settings-menu" app="Nord" aria-label="Edit Windows Controls">
                        <Render>{editWindowsControlsStructure}</Render>
                    </div>
                </>
            )
            /* eslint-enable react/no-unknown-property */
        },
        isLarge: true,
        hideOverlay: true,
    })

    // Typing a value previews it straight away. If the popup is closed without saving, go back to the
    // saved values instead of leaving the unsaved preview applied until the next restart.
    const popupSelector = `generic-modal .tetrax-settings-menu[aria-label="Edit Windows Controls"]`
    Utils.dom.waitForElement(popupSelector).then(async () => {
        await Utils.dom.waitForElementDeath(popupSelector)
        LocalStorage.tempConfig.hideWindowsControlsValues = structuredClone(LocalStorage.config.hideWindowsControlsValues)
        updateWindowsControls()
    })
}

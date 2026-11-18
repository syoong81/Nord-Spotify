import Banner from "../../../../features/banner/banner"
import dynamicallyGeneratedCss from "../../../../features/snippets/dynamicallyGeneratedSnippets/dynamicallyGeneratedCss/dynamicallyGeneratedCss"
import LocalStorage from "../../../../localStorage/localStorage"
import Utils from "../../../../utils/utils"

export default function getSettingsMenuActionInputProps() {
    return {
        fontSize: {
            name: "Font Size",
            info: "you can use %, px, em",
            field: "fontSize",
            disableWhenFieldIsFalse: "fontSizeBool",
            onChangeHandler: () => {
                Utils.dom.removeInjectedElement("fontSizeBool")
                dynamicallyGeneratedCss.utils.toggle("fontSizeBool")
            },
            buttons: [
                {
                    icon: "check",
                    field: "fontSizeBool",
                    onClickHandler: () => dynamicallyGeneratedCss.utils.toggle("fontSizeBool"),
                },
            ],
        },
        bannerBehindTrackList: {
            name: "Show Banner Behind Track Lists",
            info: "background opacity, 0 to 100",
            field: "trackListBgOpacity",
            disableWhenFieldIsFalse: "bannerBehindTrackList",
            onChangeHandler: () => {
                Utils.dom.removeInjectedElement("bannerBehindTrackList")
                dynamicallyGeneratedCss.utils.toggle("bannerBehindTrackList")
            },
            buttons: [
                {
                    icon: "check",
                    field: "bannerBehindTrackList",
                    onClickHandler: () => dynamicallyGeneratedCss.utils.toggle("bannerBehindTrackList"),
                },
            ],
        },
        bannerBlur: {
            name: "Banner Blur Amount",
            info: "0 to 100",
            field: "bannerBlurValue",
            disableWhenFieldIsFalse: "bannerBlur",
            onChangeHandler: (value) => Banner.event.updateBlur(value, "menu"),
            buttons: [
                {
                    icon: "check",
                    field: "bannerBlur",
                    onClickHandler: () => Banner.event.updateBlur(LocalStorage.config.bannerBlurValue, "menu"),
                },
            ],
        },
    }
}

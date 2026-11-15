export function changeKeyBind(newKey, oldKey, shouldMap) {
    try {
        if (shouldMap) {
            Spicetify.Keyboard.changeShortcut(oldKey, newKey)
        } else {
            Spicetify.Keyboard.changeShortcut(newKey, oldKey)
        }
    } catch (err) {
        // restoring a keybind that was never remapped is expected to find nothing
        if (!shouldMap) return

        console.error(`Nord:unexpected: can't change keybind > from: \`changeKeyBind()\` > error: ${err}`)
    }
}

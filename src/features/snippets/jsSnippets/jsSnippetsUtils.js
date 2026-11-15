// handlers that were on a key before Nord took it over, so they can be put back
const previousHandlers = {}

function findHandler(combo) {
    const directMap = Spicetify.Mousetrap.trigger()._directMap // eslint-disable-line no-underscore-dangle
    const key = Object.keys(directMap).find((entry) => entry.startsWith(`${combo}:`))

    return key ? directMap[key] : undefined
}

// Makes `newCombo` (e.g. "mod+space") do what Spotify's own `mod+<spotifyKey>` shortcut does.
// Spotify registers its shortcuts as "mod+k", which Spicetify.Keyboard.changeShortcut can no longer find,
// so the handler is looked up and bound directly. Spotify's own shortcut keeps working as well.
// `newCombo` must use "mod+" like Spotify does: Mousetrap only replaces an existing binding when the combo
// text matches exactly, so "ctrl+/" would run alongside Spotify's "mod+/" instead of replacing it.
export function changeKeyBind(newCombo, spotifyKey, shouldMap) {
    try {
        if (shouldMap) {
            const handler = findHandler(`mod+${spotifyKey}`) ?? findHandler(`ctrl+${spotifyKey}`)
            if (!handler) throw new Error(`Spotify shortcut for "${spotifyKey}" not found`)

            if (!(newCombo in previousHandlers)) {
                previousHandlers[newCombo] = findHandler(newCombo)
            }
            Spicetify.Mousetrap.bind(newCombo, handler)
        } else if (newCombo in previousHandlers) {
            // only undo a remap made in this session; otherwise there is nothing to restore
            const previousHandler = previousHandlers[newCombo]
            delete previousHandlers[newCombo]

            previousHandler ? Spicetify.Mousetrap.bind(newCombo, previousHandler) : Spicetify.Mousetrap.unbind(newCombo)
        }
    } catch (err) {
        console.error(`Nord:unexpected: can't change keybind > from: \`changeKeyBind()\` > error: ${err}`)
    }
}

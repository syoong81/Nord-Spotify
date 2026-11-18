// Spicetify.React is not defined yet when this bundle is first evaluated, so a plain
// `import React from "react"` captures `undefined`. This shim looks React up on each use instead.
const React = new Proxy(
    {},
    {
        get: (_, key) => Spicetify.React[key],
    }
)

export const useState = (...args) => Spicetify.React.useState(...args)

export default React

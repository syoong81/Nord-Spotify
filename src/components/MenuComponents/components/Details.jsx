import React from "../../../shims/react"
import Render from "../../Render/Render"

export default function Details({ title = null, content = null } = {}) {
    return (
        <details>
            <summary>
                <Render>{[title]}</Render>
            </summary>
            <Render>{content}</Render>
        </details>
    )
}

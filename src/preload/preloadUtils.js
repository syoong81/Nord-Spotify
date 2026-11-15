const PreloadUtils = (() => {
    async function waitForElement(selector, timeout = null, location = document.body) {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector))
            }

            const observer = new MutationObserver(async () => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector))
                    observer.disconnect()
                } else {
                    if (timeout) {
                        async function timeOver() {
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    observer.disconnect()
                                    resolve(false)
                                }, timeout)
                            })
                        }
                        resolve(await timeOver())
                    }
                }
            })

            observer.observe(location, {
                childList: true,
                subtree: true,
            })
        })
    }

    async function checkIfAnExtensionIsInstalled(name) {
        const scriptElement = await waitForElement(`script[src*="${name}.js"]`, 1000)
        return scriptElement ? true : false
    }

    return {
        checkIfAnExtensionIsInstalled: checkIfAnExtensionIsInstalled,
    }
})()

export default PreloadUtils

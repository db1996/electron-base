import { autoUpdater, UpdateInfo } from 'electron-updater'
import Settings from './Settings'

export default class Updater {
    public currentUpdateInfo: UpdateInfo | null = null
    public lastError: any | null = null

    public constructor() {}

    public setupAutoUpdater(): void {
        autoUpdater.forceDevUpdateConfig = true
        autoUpdater.fullChangelog = true
        autoUpdater.autoDownload = false

        autoUpdater.on('checking-for-update', () => {
            Settings.sendWebcontentUpdate('update-checking', null)
        })

        autoUpdater.on('update-available', (info) => {
            console.log('Update available:', info.version)
            this.currentUpdateInfo = info
            Settings.sendWebcontentUpdate('update-available', info)
        })

        autoUpdater.on('update-not-available', (info) => {
            console.log('Update not available:', info.version)
            this.currentUpdateInfo = info
            Settings.sendWebcontentUpdate('update-not-available', info)
        })

        autoUpdater.on('error', (err) => {
            console.log(
                `Error in auto-updater: '${err.name}', cause: '${err.cause}', stack: '${err.stack}'`
            )
            let actualerror =
                'Something went wrong while checking for updates. Please check your internet connection or try again later.'
            let errorFound = false
            if (err.stack) {
                if (err.name == 'HttpError') {
                    if (err.stack.startsWith('HttpError: 404')) {
                        actualerror =
                            'Update server not found (404). Please check your internet connection or try again later.'
                        errorFound = true
                    } else {
                        // get error code
                        const match = err.stack.match(/HttpError: (\d{3})/)
                        if (match && match[1]) {
                            actualerror = `HTTP Error ${match[1]} occurred while checking for updates. Please check your internet connection or try again later.`
                            errorFound = true
                        }
                    }
                    const match = err.stack.startsWith('Error: No published versions on GitHub')
                    if (match) {
                        actualerror = `No published versions found on update server.`
                        errorFound = true
                    }
                }

                const match2 = err.stack.startsWith(
                    'Error: Cannot parse releases feed: Error: Unable to find latest version on GitHub'
                )
                console.log('actualerror', actualerror, match2)
                if (match2) {
                    actualerror = `A new release tag was found but it does not contain any assets to download.`
                    errorFound = true
                }
            }

            if (!errorFound) {
                actualerror = ``
            }

            this.lastError = actualerror

            Settings.sendWebcontentUpdate('update-error', actualerror)
        })

        autoUpdater.on('download-progress', (progressObj) => {
            let log_message = 'Download speed: ' + progressObj.bytesPerSecond
            log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
            log_message =
                log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
            console.log(log_message)
            Settings.sendWebcontentUpdate('update-download-progress', progressObj)
        })

        autoUpdater.on('update-downloaded', (info) => {
            this.currentUpdateInfo = info
            Settings.sendWebcontentUpdate('update-downloaded', info)
        })
    }

    public async checkForUpdatesStartup(): Promise<void> {
        await Settings.load()

        try {
            if (Settings.allSettings.updateCheckAutomatically) {
                // Check for updates after a short delay to allow the app to finish loading
                let result = await autoUpdater.checkForUpdates()

                if (
                    result &&
                    Settings.allSettings.updateDownloadAutomatically &&
                    result.isUpdateAvailable
                ) {
                    console.log('Auto update download started')
                    await autoUpdater.downloadUpdate()

                    if (Settings.allSettings.updateInstallAutomatically) {
                        setTimeout(() => {
                            console.log('Auto installing update')
                            autoUpdater.quitAndInstall()
                        }, 2000)
                    }
                }
            }
        } catch (_err) {}
    }
}

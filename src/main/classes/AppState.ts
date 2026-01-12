import { app, dialog, ipcMain, Menu, shell, Tray } from 'electron'
import trayIcon from '../../../icons/icon.png?asset'
import { autoUpdater } from 'electron-updater'
import path from 'path'
import { AllSettings } from '../types/settings/AllSettings'
import Settings from './Settings'
import Updater from './Updater'
import ncp from 'copy-paste'
import { randomUUID } from 'crypto'
import fs from 'fs'

export default class AppState {
    public tray: Tray | null = null
    public updaterInstance: Updater | null = null

    constructor() {
        this.updaterInstance = new Updater()
        this.updaterInstance.setupAutoUpdater()
    }

    public async init() {
        this.registerIpcHandlers()

        if (Settings.allSettings.theme.showTrayIcon && !this.tray) {
            this.createTray()
        }
    }

    public registerWindowHandlers() {
        if (!Settings.mainWindow) return
        Settings.mainWindow.on('ready-to-show', () => {
            if (!Settings.allSettings.theme.startInTray) Settings.mainWindow?.show()

            if (Settings.allSettings.theme.showTrayIcon && !this.tray) {
                this.createTray()
            }
        })

        Settings.mainWindow.on('close', (event) => {
            if (
                Settings.allSettings.theme.showTrayIcon &&
                Settings.allSettings.theme.minimizeToTray
            ) {
                event.preventDefault()
                Settings.mainWindow?.hide()
                if (!this.tray) {
                    this.createTray()
                }
            }
        })
    }

    private registerIpcHandlers() {
        ipcMain.handle('save-allsettings', async (_event, allSettings: AllSettings) => {
            console.log('Saving all settings from ipcMain handler')

            await Settings.saveAllSettings(allSettings)

            if (allSettings.theme.showTrayIcon) {
                if (!this.tray) {
                    console.log('Creating tray')

                    this.createTray()
                }
            } else {
                this.destroyTray()
            }
        })
        ipcMain.handle('get-allsettings', async () => {
            return Settings.allSettings
        })

        ipcMain.handle('get-uuid', () => {
            return randomUUID().toString()
        })

        ipcMain.handle('choose-folder', async (_event, defaultPath?: string) => {
            const result = await dialog.showOpenDialog({
                properties: ['openDirectory'],
                defaultPath: defaultPath || undefined
            })

            return {
                path: result.filePaths[0] || null,
                basename: result.filePaths[0] ? path.basename(result.filePaths[0]) : null
            }
        })

        ipcMain.handle('choose-files', async () => {
            const result = await dialog.showOpenDialog({
                properties: ['openFile', 'multiSelections']
            })

            const ret: string[] = []
            for (const file of result.filePaths) {
                if (file !== undefined && file !== null && file !== '') {
                    ret.push(file)
                }
            }
            return ret
        })

        ipcMain.handle('choose-folders', async () => {
            const result = await dialog.showOpenDialog({
                properties: ['openDirectory', 'multiSelections']
            })

            const ret: string[] = []
            for (const file of result.filePaths) {
                if (file !== undefined && file !== null && file !== '') {
                    ret.push(file)
                }
            }
            return ret
        })

        ipcMain.handle('save-file', async (_event, filename: string, content: string) => {
            const result = await dialog.showSaveDialog({
                defaultPath: filename,
                filters: [
                    {
                        name: 'File',
                        extensions: [path.extname(filename).replace('.', '')]
                    }
                ]
            })

            if (result.canceled || !result.filePath) {
                return { success: false, filePath: null }
            }

            try {
                fs.writeFileSync(result.filePath, content, 'utf-8')
                return { success: true, filePath: result.filePath }
            } catch (err) {
                console.error('Failed to save file:', err)
                return { success: false, filePath: null }
            }
        })

        ipcMain.handle('open-folder-in-explorer', async (_event, path: string) => {
            shell.openPath(path)
        })

        ipcMain.handle('open-file-in-explorer', async (_event, path: string) => {
            shell.showItemInFolder(path)
        })

        ipcMain.handle('copy', async (_event, text: string) => {
            try {
                ncp.copy(text)
                return true
            } catch (error) {
                return false
            }
        })

        ipcMain.handle('check-for-updates', async () => {
            try {
                return await autoUpdater.checkForUpdatesAndNotify()
            } catch (error) {
                console.error('Error checking for updates:', error)
                return null
            }
        })

        ipcMain.handle('download-update', async () => {
            console.log('download for update icp')
            try {
                return await autoUpdater.downloadUpdate()
            } catch (error) {
                console.error('Error downloading update:', error)
                return false
            }
        })

        ipcMain.handle('quit-and-install', () => {
            autoUpdater.quitAndInstall()
        })

        ipcMain.handle('get-version', () => {
            return app.getVersion()
        })

        ipcMain.handle('check-update-startup', () => {
            this.updaterInstance?.checkForUpdatesStartup()
        })

        ipcMain.handle('get-current-version', () => {
            return app.getVersion()
        })
    }

    public createTray(): void {
        if (this.tray) return // Tray already exists

        this.tray = new Tray(trayIcon)

        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Show',
                click: () => {
                    if (Settings.mainWindow) {
                        Settings.mainWindow.show()
                        Settings.mainWindow.focus()
                    }
                }
            },
            {
                label: 'Hide',
                click: () => {
                    if (Settings.mainWindow) {
                        Settings.mainWindow.hide()
                    }
                }
            },
            { type: 'separator' },
            {
                label: 'Quit',
                click: () => {
                    if (this.tray) {
                        this.tray.destroy()
                    }
                    app.quit()
                }
            }
        ])

        this.tray.setContextMenu(contextMenu)
        this.tray.setToolTip('Electron App')

        this.tray.on('double-click', () => {
            if (Settings.mainWindow) {
                if (Settings.mainWindow.isVisible()) {
                    Settings.mainWindow.hide()
                } else {
                    Settings.mainWindow.show()
                    Settings.mainWindow.focus()
                }
            }
        })
    }

    public destroyTray(): void {
        if (this.tray) {
            this.tray.destroy()
            this.tray = null
        }
    }
}

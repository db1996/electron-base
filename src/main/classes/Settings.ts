import { AllSettings } from '../types/settings/AllSettings'
import { SettingsManager } from '../managers/SettingsManager'
import AutoLaunch from 'auto-launch'
import { app } from 'electron'

export default class Settings {
    static loaded: boolean = false
    static mainWindow: Electron.BrowserWindow | null = null
    private static settingsManager = SettingsManager.getInstance()
    private static autoLauncher: AutoLaunch | null = null

    static get allSettings(): AllSettings {
        return Settings.settingsManager.settings
    }

    static async load(forceReload: boolean = false): Promise<void> {
        if (Settings.loaded && !forceReload) {
            return
        }

        try {
            await Settings.settingsManager.initialize()
            await Settings.initializeAutoLaunch()
            Settings.loaded = true
            console.log('Settings loaded', Settings.allSettings)
        } catch (error) {
            console.error('Error loading settings:', error)
            Settings.loaded = true // Set to true even on error to prevent infinite retry
        }
    }

    static async loadMainSettings(): Promise<AllSettings> {
        return await Settings.settingsManager.reloadSettings()
    }

    static async saveAllSettings(allSettings: AllSettings): Promise<void> {
        const oldStartWithSystem = Settings.allSettings.system.startWithSystem
        const oldStartInTray = Settings.allSettings.system.startInTray

        await Settings.settingsManager.saveSettings(allSettings)

        const newStartWithSystem = allSettings.system.startWithSystem
        const newStartInTray = allSettings.system.startInTray

        // Handle auto-launch changes
        await Settings.handleAutoLaunchChange(oldStartWithSystem, newStartWithSystem)
        await Settings.handleAutoLaunchConfigurationUpdate(
            oldStartInTray,
            newStartInTray,
            newStartWithSystem
        )
    }

    static async updateSettings(partialSettings: Partial<AllSettings>): Promise<AllSettings> {
        const oldStartWithSystem = Settings.allSettings.system.startWithSystem
        const oldStartInTray = Settings.allSettings.system.startInTray

        const result = await Settings.settingsManager.updateSettings(partialSettings)

        // Check if startWithSystem was changed
        const newStartWithSystem = result.system.startWithSystem
        const newStartInTray = result.system.startInTray

        // Handle auto-launch changes
        await Settings.handleAutoLaunchChange(oldStartWithSystem, newStartWithSystem)
        await Settings.handleAutoLaunchConfigurationUpdate(
            oldStartInTray,
            newStartInTray,
            newStartWithSystem
        )

        return result
    }

    static generateString(length: number): string {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let result = ''
        for (let i = 0; i < length; i++) {
            result += characters[Math.floor(Math.random() * characters.length)]
        }
        return result
    }

    static sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    /**
     * Initialize auto-launch functionality
     */
    private static async initializeAutoLaunch(): Promise<void> {
        try {
            // Skip auto-launch in development mode
            if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
                console.log('Skipping auto-launch setup in development mode')
                return
            }

            if (!Settings.autoLauncher) {
                Settings.autoLauncher = new AutoLaunch({
                    name: app.getName(),
                    path: process.execPath,
                    isHidden: Settings.allSettings.system.startInTray
                })
            }

            // Set auto-launch based on current settings
            const shouldAutoLaunch = Settings.allSettings.system.startWithSystem
            const isEnabled = await Settings.autoLauncher.isEnabled()

            if (shouldAutoLaunch && !isEnabled) {
                await Settings.autoLauncher.enable()
                console.log('Auto-launch enabled')
            } else if (!shouldAutoLaunch && isEnabled) {
                await Settings.autoLauncher.disable()
                console.log('Auto-launch disabled')
            }
        } catch (error) {
            console.error('Error initializing auto-launch:', error)
        }
    }

    /**
     * Handle auto-launch configuration updates when startInTray changes
     */
    private static async handleAutoLaunchConfigurationUpdate(
        oldStartInTray: boolean,
        newStartInTray: boolean,
        newStartWithSystem: boolean
    ): Promise<void> {
        if (oldStartInTray !== newStartInTray && newStartWithSystem && Settings.autoLauncher) {
            // Skip auto-launch in development mode
            if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
                console.log('Skipping auto-launch configuration update in development mode')
            } else {
                try {
                    Settings.autoLauncher = new AutoLaunch({
                        name: app.getName(),
                        path: process.execPath,
                        isHidden: newStartInTray
                    })
                    await Settings.autoLauncher.enable()
                    console.log(
                        `Auto-launch configuration updated - startInTray: ${newStartInTray}`
                    )
                } catch (error) {
                    console.error('Error updating auto-launch configuration:', error)
                }
            }
        }
    }

    /**
     * Handle changes to startWithSystem setting
     */
    private static async handleAutoLaunchChange(
        oldValue: boolean,
        newValue: boolean
    ): Promise<void> {
        if (oldValue === newValue || !Settings.autoLauncher) {
            return
        }

        // Skip auto-launch in development mode
        if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
            console.log('Skipping auto-launch update in development mode')
            return
        }

        try {
            // Update the auto-launcher configuration with current settings
            Settings.autoLauncher = new AutoLaunch({
                name: app.getName(),
                path: process.execPath,
                isHidden: Settings.allSettings.system.startInTray
            })

            if (newValue) {
                await Settings.autoLauncher.enable()
                console.log('Auto-launch enabled')
            } else {
                await Settings.autoLauncher.disable()
                console.log('Auto-launch disabled')
            }
        } catch (error) {
            console.error('Error updating auto-launch setting:', error)
        }
    }

    // Let other classes register to receive webcontent updates by registering a callback function with channel name
    private static webcontentUpdateCallbacks: { channel: string; callback: (data: any) => void }[] =
        []

    static registerWebcontentUpdateCallback(channel: string, callback: (data: any) => void) {
        Settings.webcontentUpdateCallbacks.push({ channel, callback })
    }

    static unregisterWebcontentUpdateCallback(channel: string, callback: (data: any) => void) {
        Settings.webcontentUpdateCallbacks = Settings.webcontentUpdateCallbacks.filter(
            (item) => item.channel !== channel || item.callback !== callback
        )
    }

    static sendWebcontentUpdate(channel: string, data: any) {
        if (Settings.mainWindow) {
            Settings.mainWindow.webContents.send(channel, data)
        }

        // Also call registered callbacks
        for (const registeredCallback of Settings.webcontentUpdateCallbacks) {
            if (registeredCallback.channel === channel) {
                registeredCallback.callback(data)
            }
        }
    }

    static sanitize(data: string): string {
        return data
            .trim()
            .replace(/\n$/, '')
            .replace(/\r$/, '')
            .replace(/\n\r$/, '')
            .replace(/\\b$/, '')
            .replace(/[^\x20-\x7E]/g, '')
    }
}

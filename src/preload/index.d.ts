import { ElectronAPI } from '@electron-toolkit/preload'
import { AllSettings } from '@main/types/settings/AllSettings'
import { ProgressInfo, UpdateInfo } from 'electron-updater'

declare global {
    interface Window {
        electron: ElectronAPI
        dragDrop: {}
        api: {
            // Settings APIs
            getAllSettings: () => Promise<AllSettings>
            saveAllSettings: (settings: AllSettings) => Promise<void>
            settingsLoaded: (callback: (settings: AllSettings) => void) => void
            reloadSettings: (callback: () => void) => void

            // utils
            copy: (text: string) => Promise<boolean>
            getUUID: () => Promise<string>
            getCurrentVersion: () => Promise<string>

            // File and folders
            chooseFolder: (defaultPath?: string) => Promise<{
                path: string
                basename: string
            }>
            chooseFiles: () => Promise<string[]>
            chooseFolders: () => Promise<string[]>
            openFolderInExplorer: (path: string) => Promise<void>
            openFileInExplorer: (path: string) => Promise<void>
            saveFile: (filePath: string, content: string) => Promise<void>

            // Auto-updater APIs
            checkForUpdates: () => Promise<any>
            downloadUpdate: () => Promise<boolean>
            quitAndInstall: () => void
            getVersion: () => Promise<string>

            // Auto-updater event listeners
            onUpdateChecking: (callback: () => void) => void
            onUpdateAvailable: (callback: (info: UpdateInfo) => void) => void
            onUpdateNotAvailable: (callback: (info: UpdateInfo) => void) => void
            onUpdateError: (callback: (error: string) => void) => void
            onUpdateDownloadProgress: (callback: (progress: ProgressInfo) => void) => void
            onUpdateDownloaded: (callback: (info: UpdateInfo) => void) => void
            checkUpdateOnStartup: () => Promise<void>

            // Options APIs
            optionsGet: (key: string, defaultValue?: string) => Promise<string | null>
            optionsSet: (key: string, value: string) => Promise<boolean>
            optionsDelete: (key: string) => Promise<boolean>
            optionsHas: (key: string) => Promise<boolean>
            optionsGetAll: () => Promise<Record<string, string>>
            optionsGetBool: (key: string, defaultValue?: boolean) => Promise<boolean>
            optionsSetBool: (key: string, value: boolean) => Promise<boolean>
            optionsGetNumber: (key: string, defaultValue?: number) => Promise<number>
            optionsSetNumber: (key: string, value: number) => Promise<boolean>
        }
    }
}

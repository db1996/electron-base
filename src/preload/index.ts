import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { AllSettings } from '../main/types/settings/AllSettings'

// Custom APIs for renderer
const api = {
    getAllSettings: () => electronAPI.ipcRenderer.invoke('get-allsettings'),
    saveAllSettings: async (settings: AllSettings) =>
        await electronAPI.ipcRenderer.invoke('save-allsettings', settings),
    settingsLoaded: (callback: (arg0: AllSettings) => void) =>
        electronAPI.ipcRenderer.on('settings-loaded', (_, data: AllSettings) => callback(data)),
    reloadSettings: (callback: () => void) =>
        electronAPI.ipcRenderer.on('reload-settings', () => callback()),

    // utils
    copy: async (text: string) => electronAPI.ipcRenderer.invoke('copy', text),
    getUUID: () => electronAPI.ipcRenderer.invoke('get-uuid'),
    getCurrentVersion: () => electronAPI.ipcRenderer.invoke('get-current-version'),

    // File and folders
    chooseFolder: async (defaultPath?: string) =>
        electronAPI.ipcRenderer.invoke('choose-folder', defaultPath),
    chooseFiles: () => electronAPI.ipcRenderer.invoke('choose-files'),
    chooseFolders: () => electronAPI.ipcRenderer.invoke('choose-folders'),
    openFolderInExplorer: (path: string) =>
        electronAPI.ipcRenderer.invoke('open-folder-in-explorer', path),
    openFileInExplorer: (path: string) =>
        electronAPI.ipcRenderer.invoke('open-file-in-explorer', path),
    saveFile: async (filePath: string, content: string) =>
        electronAPI.ipcRenderer.invoke('save-file', filePath, content),

    // Auto-updater APIs
    checkForUpdates: () => electronAPI.ipcRenderer.invoke('check-for-updates'),
    downloadUpdate: () => electronAPI.ipcRenderer.invoke('download-update'),
    quitAndInstall: () => electronAPI.ipcRenderer.invoke('quit-and-install'),
    getVersion: () => electronAPI.ipcRenderer.invoke('get-version'),

    // Auto-updater event listeners
    onUpdateChecking: (callback: () => void) =>
        electronAPI.ipcRenderer.on('update-checking', () => callback()),
    onUpdateAvailable: (callback: (arg0: any) => void) =>
        electronAPI.ipcRenderer.on('update-available', (_, info) => callback(info)),
    onUpdateNotAvailable: (callback: (arg0: any) => void) =>
        electronAPI.ipcRenderer.on('update-not-available', (_, info) => callback(info)),
    onUpdateError: (callback: (arg0: string) => void) =>
        electronAPI.ipcRenderer.on('update-error', (_, error) => callback(error)),
    onUpdateDownloadProgress: (callback: (arg0: any) => void) =>
        electronAPI.ipcRenderer.on('update-download-progress', (_, progress) => callback(progress)),
    onUpdateDownloaded: (callback: (arg0: any) => void) =>
        electronAPI.ipcRenderer.on('update-downloaded', (_, info) => callback(info)),

    // Options APIs
    optionsGet: (key: string, defaultValue?: string) =>
        electronAPI.ipcRenderer.invoke('options-get', key, defaultValue),
    optionsSet: (key: string, value: string) =>
        electronAPI.ipcRenderer.invoke('options-set', key, value),
    optionsDelete: (key: string) => electronAPI.ipcRenderer.invoke('options-delete', key),
    optionsHas: (key: string) => electronAPI.ipcRenderer.invoke('options-has', key),
    optionsGetAll: () => electronAPI.ipcRenderer.invoke('options-get-all'),
    optionsGetBool: (key: string, defaultValue?: boolean) =>
        electronAPI.ipcRenderer.invoke('options-get-bool', key, defaultValue),
    optionsSetBool: (key: string, value: boolean) =>
        electronAPI.ipcRenderer.invoke('options-set-bool', key, value),
    optionsGetNumber: (key: string, defaultValue?: number) =>
        electronAPI.ipcRenderer.invoke('options-get-number', key, defaultValue),
    optionsSetNumber: (key: string, value: number) =>
        electronAPI.ipcRenderer.invoke('options-set-number', key, value),
    checkUpdateOnStartup: () => electronAPI.ipcRenderer.invoke('check-update-startup')
}

if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.api = api
}

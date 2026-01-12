import fs from 'fs'
import path from 'node:path'
import { app } from 'electron'
import { AllSettings } from '../types/settings/AllSettings'
import { SettingsModel } from '../models/Settings'
import Settings from '../classes/Settings'

export class SettingsBackup {
    /**
     * Export current settings to a JSON file
     */
    static async exportToJson(filePath?: string): Promise<string> {
        const exportPath =
            filePath || path.join(app.getPath('userData'), `settings-backup-${Date.now()}.json`)

        const settingsRecord = await SettingsModel.findOne()
        const allSettings = settingsRecord?.toAllSettings() || Settings.allSettings

        const exportData = {
            exportedAt: new Date().toISOString(),
            version: app.getVersion(),
            settings: allSettings
        }

        fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2))
        console.log(`Settings exported to: ${exportPath}`)

        return exportPath
    }

    /**
     * Import settings from a JSON file
     */
    static async importFromJson(filePath: string): Promise<AllSettings> {
        if (!fs.existsSync(filePath)) {
            throw new Error(`Import file not found: ${filePath}`)
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const importData = JSON.parse(fileContent)

        let settingsToImport: AllSettings

        // Handle different import formats
        if (importData.settings) {
            // New format with metadata
            settingsToImport = importData.settings
        } else if (importData.theme && importData.updateCheckAutomatically !== undefined) {
            // Direct AllSettings format
            settingsToImport = importData
        } else {
            throw new Error('Invalid settings file format')
        }

        // Save the imported settings
        await Settings.saveAllSettings(settingsToImport)

        console.log(`Settings imported from: ${filePath}`)
        return settingsToImport
    }

    /**
     * Create automatic backup before making changes
     */
    static async createAutoBackup(): Promise<string> {
        const backupDir = path.join(app.getPath('userData'), 'backups')

        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true })
        }

        const backupPath = path.join(backupDir, `settings-auto-backup-${Date.now()}.json`)
        return await this.exportToJson(backupPath)
    }

    /**
     * Clean up old automatic backups (keep only last 5)
     */
    static cleanupOldBackups(): void {
        const backupDir = path.join(app.getPath('userData'), 'backups')

        if (!fs.existsSync(backupDir)) {
            return
        }

        const backupFiles = fs
            .readdirSync(backupDir)
            .filter((file) => file.startsWith('settings-auto-backup-') && file.endsWith('.json'))
            .map((file) => ({
                name: file,
                path: path.join(backupDir, file),
                mtime: fs.statSync(path.join(backupDir, file)).mtime
            }))
            .sort((a, b) => b.mtime.getTime() - a.mtime.getTime()) // Sort by modification time, newest first

        // Keep only the 5 most recent backups
        const filesToDelete = backupFiles.slice(5)

        filesToDelete.forEach((file) => {
            try {
                fs.unlinkSync(file.path)
                console.log(`Deleted old backup: ${file.name}`)
            } catch (error) {
                console.error(`Error deleting backup file ${file.name}:`, error)
            }
        })
    }
}

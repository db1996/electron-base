import { AllSettings, AllSettingsYupSchema } from '../types/settings/AllSettings'
import { SettingsModel } from '../models/Settings'
import { initializeDatabase } from '../database'
import { runMigrations } from '../migrations/runner'

/**
 * Centralized settings manager that handles all database operations
 * and provides a clean interface for the rest of the application
 */
export class SettingsManager {
    private static _instance: SettingsManager
    private _currentSettings: AllSettings | null = null
    private _initialized = false

    private constructor() {}

    public static getInstance(): SettingsManager {
        if (!SettingsManager._instance) {
            SettingsManager._instance = new SettingsManager()
        }
        return SettingsManager._instance
    }

    /**
     * Initialize the settings manager - call this once at app startup
     */
    public async initialize(): Promise<void> {
        if (this._initialized) return

        try {
            await initializeDatabase()
            await runMigrations()
            await this.loadSettings()
            this._initialized = true
        } catch (error) {
            console.error('Failed to initialize settings manager:', error)
            // Fallback to defaults
            this._currentSettings = AllSettingsYupSchema.cast({})
            this._initialized = true
        }
    }

    /**
     * Get current settings (cached)
     */
    public get settings(): AllSettings {
        if (!this._currentSettings) {
            throw new Error('Settings manager not initialized')
        }
        return this._currentSettings
    }

    /**
     * Load settings from database
     */
    private async loadSettings(): Promise<void> {
        try {
            let settingsRecord = await SettingsModel.findOne()

            if (!settingsRecord) {
                // Create defaults
                const defaults = AllSettingsYupSchema.cast({})
                settingsRecord = await SettingsModel.create(SettingsModel.fromAllSettings(defaults))
            }

            this._currentSettings = settingsRecord.toAllSettings()
        } catch (error) {
            console.error('Error loading settings:', error)
            this._currentSettings = AllSettingsYupSchema.cast({})
        }
    }

    /**
     * Save settings to database
     */
    public async saveSettings(settings: AllSettings): Promise<void> {
        try {
            // Validate first
            const validated = await AllSettingsYupSchema.validate(settings, {
                stripUnknown: true,
                abortEarly: false
            })

            // Update database
            let settingsRecord = await SettingsModel.findOne()

            if (settingsRecord) {
                await settingsRecord.update(SettingsModel.fromAllSettings(validated))
            } else {
                settingsRecord = await SettingsModel.create(
                    SettingsModel.fromAllSettings(validated)
                )
            }

            // Update cache
            this._currentSettings = validated
        } catch (error) {
            console.error('Error saving settings:', error)
            throw error
        }
    }

    /**
     * Update partial settings
     */
    public async updateSettings(partialSettings: Partial<AllSettings>): Promise<AllSettings> {
        const current = this.settings
        const updated = { ...current, ...partialSettings }

        // Handle nested theme object
        if (partialSettings.theme) {
            updated.theme = { ...current.theme, ...partialSettings.theme }
        }

        await this.saveSettings(updated)
        return updated
    }

    /**
     * Reload settings from database (clears cache)
     */
    public async reloadSettings(): Promise<AllSettings> {
        await this.loadSettings()
        return this.settings
    }

    /**
     * Reset to defaults
     */
    public async resetToDefaults(): Promise<AllSettings> {
        await SettingsModel.destroy({ where: {} })
        await this.loadSettings()
        return this.settings
    }
}

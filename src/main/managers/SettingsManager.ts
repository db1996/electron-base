import { AllSettings } from '../types/settings/AllSettings'
import { databaseService, SettingsRepository } from '../database'

/**
 * Simplified settings manager using repository pattern
 * Provides a clean interface for the rest of the application
 */
export class SettingsManager {
    private static _instance: SettingsManager
    private _settingsRepo: SettingsRepository
    private _currentSettings: AllSettings | null = null
    private _initialized = false

    private constructor() {
        this._settingsRepo = SettingsRepository.getInstance()
    }

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
            // Initialize database service (handles migrations, model registration, etc.)
            await databaseService.initialize()

            // Load current settings
            await this.loadSettings()
            this._initialized = true
        } catch (error) {
            console.error('Failed to initialize settings manager:', error)
            throw error
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
     * Load settings from database via repository
     */
    private async loadSettings(): Promise<void> {
        try {
            this._currentSettings = await this._settingsRepo.getSettings()
        } catch (error) {
            console.error('Error loading settings:', error)
            throw error
        }
    }

    /**
     * Save complete settings
     */
    public async saveSettings(settings: AllSettings): Promise<void> {
        try {
            const updated = await this._settingsRepo.updateSettings(settings)
            this._currentSettings = updated
        } catch (error) {
            console.error('Error saving settings:', error)
            throw error
        }
    }

    /**
     * Update partial settings
     */
    public async updateSettings(partialSettings: Partial<AllSettings>): Promise<AllSettings> {
        try {
            const updated = await this._settingsRepo.updateSettings(partialSettings)
            this._currentSettings = updated
            return updated
        } catch (error) {
            console.error('Error updating settings:', error)
            throw error
        }
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
        try {
            const defaults = await this._settingsRepo.resetSettings()
            this._currentSettings = defaults
            return defaults
        } catch (error) {
            console.error('Error resetting settings:', error)
            throw error
        }
    }
}

import {
    AllSettings,
    AllSettingsYupSchema,
    defaultSettings
} from '../../types/settings/AllSettings'
import { SettingsModel } from '../models/SettingsModel'

/**
 * Repository pattern for Settings data access
 * Now uses generated defaults and validation - much cleaner!
 */
export class SettingsRepository {
    private static _instance: SettingsRepository

    private constructor() {}

    public static getInstance(): SettingsRepository {
        if (!SettingsRepository._instance) {
            SettingsRepository._instance = new SettingsRepository()
        }
        return SettingsRepository._instance
    }

    /**
     * Get current settings (returns defaults if none exist)
     */
    async getSettings(): Promise<AllSettings> {
        try {
            let settingsRecord = await SettingsModel.findOne()

            if (!settingsRecord) {
                // Use generated defaults instead of Yup casting
                settingsRecord = await this.createSettings(defaultSettings)
            }

            return settingsRecord.toAllSettings()
        } catch (error) {
            console.error('Error retrieving settings:', error)
            // Return generated defaults on error
            return defaultSettings
        }
    }

    /**
     * Create new settings record
     */
    async createSettings(settings: AllSettings): Promise<SettingsModel> {
        const validated = await AllSettingsYupSchema.validate(settings, {
            stripUnknown: true,
            abortEarly: false
        })

        return await SettingsModel.create(SettingsModel.fromAllSettings(validated))
    }

    /**
     * Update existing settings
     */
    async updateSettings(updates: Partial<AllSettings>): Promise<AllSettings> {
        const currentSettings = await this.getSettings()

        // Deep merge updates with current settings
        const mergedSettings: AllSettings = {
            theme: { ...currentSettings.theme, ...(updates.theme || {}) },
            system: { ...currentSettings.system, ...(updates.system || {}) },
            updater: { ...currentSettings.updater, ...(updates.updater || {}) }
        }

        const validated = await AllSettingsYupSchema.validate(mergedSettings, {
            stripUnknown: true,
            abortEarly: false
        })

        let settingsRecord = await SettingsModel.findOne()
        if (settingsRecord) {
            await settingsRecord.update(SettingsModel.fromAllSettings(validated))
            return settingsRecord.toAllSettings()
        } else {
            settingsRecord = await this.createSettings(validated)
            return settingsRecord.toAllSettings()
        }
    }

    /**
     * Reset settings to defaults
     */
    async resetSettings(): Promise<AllSettings> {
        await SettingsModel.destroy({ where: {} })
        const newRecord = await this.createSettings(defaultSettings)
        return newRecord.toAllSettings()
    }

    /**
     * Update a specific theme setting
     */
    async updateThemeSettings(updates: Partial<AllSettings['theme']>): Promise<AllSettings> {
        return this.updateSettings({ theme: updates as AllSettings['theme'] })
    }

    /**
     * Update a specific system setting
     */
    async updateSystemSettings(updates: Partial<AllSettings['system']>): Promise<AllSettings> {
        return this.updateSettings({ system: updates as AllSettings['system'] })
    }

    /**
     * Update a specific updater setting
     */
    async updateUpdaterSettings(updates: Partial<AllSettings['updater']>): Promise<AllSettings> {
        return this.updateSettings({ updater: updates as AllSettings['updater'] })
    }
}

import { DataTypes, ModelAttributes } from 'sequelize'
import * as yup from 'yup'

/**
 * Single source of truth for all settings schema definitions
 * Simple and working approach
 */

// Simple TypeScript types
export type ThemeSettings = {
    type: 'light' | 'dark' | 'system'
    datesLocale: 'nl-NL' | 'us-US'
    sidebarOpen: boolean
}

export type SystemSettings = {
    showTrayIcon: boolean
    minimizeToTray: boolean
    startInTray: boolean
    startWithSystem: boolean
}

export type UpdaterSettings = {
    checkAutomatically: boolean
    downloadAutomatically: boolean
    installAutomatically: boolean
}

export type AllSettings = {
    theme: ThemeSettings
    system: SystemSettings
    updater: UpdaterSettings
}

// Flattened type for database model
export type FlatSettingsAttributes = {
    id: number
    // Theme fields (flattened with prefix)
    themeType: 'light' | 'dark' | 'system'
    themeDatesLocale: 'nl-NL' | 'us-US'
    themeSidebarOpen: boolean
    // System fields (flattened with prefix)
    systemShowTrayIcon: boolean
    systemMinimizeToTray: boolean
    systemStartInTray: boolean
    systemStartWithSystem: boolean
    // Updater fields (flattened with prefix)
    updaterCheckAutomatically: boolean
    updaterDownloadAutomatically: boolean
    updaterInstallAutomatically: boolean
    // Timestamps
    createdAt?: Date
    updatedAt?: Date
}

// Individual Yup schemas
export const ThemeYupSchema = yup.object({
    type: yup.string().oneOf(['light', 'dark', 'system']).default('system'),
    datesLocale: yup.string().oneOf(['nl-NL', 'us-US']).default('nl-NL'),
    sidebarOpen: yup.boolean().default(true)
})

export const SystemSettingsYupSchema = yup.object({
    showTrayIcon: yup.boolean().default(false),
    minimizeToTray: yup.boolean().default(false),
    startInTray: yup.boolean().default(false),
    startWithSystem: yup.boolean().default(false)
})

export const UpdaterSettingsYupSchema = yup.object({
    checkAutomatically: yup.boolean().default(true),
    downloadAutomatically: yup.boolean().default(false),
    installAutomatically: yup.boolean().default(false)
})

// Combined AllSettings Yup schema
export const AllSettingsYupSchema = yup.object({
    theme: ThemeYupSchema.default(() => ThemeYupSchema.cast({})),
    system: SystemSettingsYupSchema.default(() => SystemSettingsYupSchema.cast({})),
    updater: UpdaterSettingsYupSchema.default(() => UpdaterSettingsYupSchema.cast({}))
}) as yup.Schema<AllSettings>

// Default settings
export const defaultSettings: AllSettings = {
    theme: {
        type: 'system',
        datesLocale: 'nl-NL',
        sidebarOpen: true
    },
    system: {
        showTrayIcon: false,
        minimizeToTray: false,
        startInTray: false,
        startWithSystem: false
    },
    updater: {
        checkAutomatically: true,
        downloadAutomatically: false,
        installAutomatically: false
    }
}

/**
 * Schema utilities class
 */
export class SettingsSchemaGenerator {
    /**
     * Generate Sequelize ModelAttributes
     */
    static generateSequelizeAttributes(): ModelAttributes {
        return {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            // Theme fields
            themeType: {
                type: DataTypes.ENUM('light', 'dark', 'system'),
                allowNull: false,
                defaultValue: 'system'
            },
            themeDatesLocale: {
                type: DataTypes.ENUM('nl-NL', 'us-US'),
                allowNull: false,
                defaultValue: 'nl-NL'
            },
            themeSidebarOpen: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            // System fields
            systemShowTrayIcon: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            systemMinimizeToTray: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            systemStartInTray: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            systemStartWithSystem: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            // Updater fields
            updaterCheckAutomatically: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            updaterDownloadAutomatically: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            updaterInstallAutomatically: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        }
    }

    /**
     * Convert AllSettings to flat database format
     */
    static toFlatFormat(
        settings: AllSettings
    ): Omit<FlatSettingsAttributes, 'id' | 'createdAt' | 'updatedAt'> {
        return {
            themeType: settings.theme.type,
            themeDatesLocale: settings.theme.datesLocale,
            themeSidebarOpen: settings.theme.sidebarOpen,
            systemShowTrayIcon: settings.system.showTrayIcon,
            systemMinimizeToTray: settings.system.minimizeToTray,
            systemStartInTray: settings.system.startInTray,
            systemStartWithSystem: settings.system.startWithSystem,
            updaterCheckAutomatically: settings.updater.checkAutomatically,
            updaterDownloadAutomatically: settings.updater.downloadAutomatically,
            updaterInstallAutomatically: settings.updater.installAutomatically
        }
    }

    /**
     * Convert flat database format to AllSettings
     */
    static fromFlatFormat(flatSettings: FlatSettingsAttributes): AllSettings {
        return {
            theme: {
                type: flatSettings.themeType,
                datesLocale: flatSettings.themeDatesLocale,
                sidebarOpen: flatSettings.themeSidebarOpen
            },
            system: {
                showTrayIcon: flatSettings.systemShowTrayIcon,
                minimizeToTray: flatSettings.systemMinimizeToTray,
                startInTray: flatSettings.systemStartInTray,
                startWithSystem: flatSettings.systemStartWithSystem
            },
            updater: {
                checkAutomatically: flatSettings.updaterCheckAutomatically,
                downloadAutomatically: flatSettings.updaterDownloadAutomatically,
                installAutomatically: flatSettings.updaterInstallAutomatically
            }
        }
    }
}

// Export generated schemas and types
export const sequelizeAttributes = SettingsSchemaGenerator.generateSequelizeAttributes()

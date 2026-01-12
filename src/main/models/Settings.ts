import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../database'
import { AllSettings } from '../types/settings/AllSettings'

// Define the attributes for the Settings model
interface SettingsAttributes {
    id: number
    // Theme settings
    themeType: 'light' | 'dark' | 'system'
    datesLocale: 'nl-NL' | 'us-US'
    sidebarOpen: boolean
    // System settings
    showTrayIcon: boolean
    minimizeToTray: boolean
    startInTray: boolean
    startWithSystem: boolean
    // Updater settings
    updateCheckAutomatically: boolean
    updateDownloadAutomatically: boolean
    updateInstallAutomatically: boolean
    // Timestamps
    createdAt?: Date
    updatedAt?: Date
}

// Define creation attributes (optional id and timestamps)
interface SettingsCreationAttributes
    extends Optional<SettingsAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Define the Settings model class
class SettingsModel
    extends Model<SettingsAttributes, SettingsCreationAttributes>
    implements SettingsAttributes
{
    declare id: number
    declare themeType: 'light' | 'dark' | 'system'
    declare datesLocale: 'nl-NL' | 'us-US'
    declare sidebarOpen: boolean
    declare showTrayIcon: boolean
    declare minimizeToTray: boolean
    declare startInTray: boolean
    declare startWithSystem: boolean
    declare updateCheckAutomatically: boolean
    declare updateDownloadAutomatically: boolean
    declare updateInstallAutomatically: boolean
    declare readonly createdAt: Date
    declare readonly updatedAt: Date

    // Convert database model to AllSettings format for frontend
    public toAllSettings(): AllSettings {
        return {
            theme: {
                type: this.themeType || 'system',
                datesLocale: this.datesLocale || 'nl-NL',
                sidebarOpen: this.sidebarOpen !== undefined ? this.sidebarOpen : true
            },
            system: {
                showTrayIcon: this.showTrayIcon !== undefined ? this.showTrayIcon : false,
                minimizeToTray: this.minimizeToTray !== undefined ? this.minimizeToTray : false,
                startInTray: this.startInTray !== undefined ? this.startInTray : false,
                startWithSystem: this.startWithSystem !== undefined ? this.startWithSystem : false
            },
            updater: {
                updateCheckAutomatically:
                    this.updateCheckAutomatically !== undefined ? this.updateCheckAutomatically : true,
                updateDownloadAutomatically:
                    this.updateDownloadAutomatically !== undefined
                        ? this.updateDownloadAutomatically
                        : false,
                updateInstallAutomatically:
                    this.updateInstallAutomatically !== undefined
                        ? this.updateInstallAutomatically
                        : false
            }
        }
    }

    // Static method to create from AllSettings format
    public static fromAllSettings(allSettings: AllSettings): SettingsCreationAttributes {
        return {
            themeType: allSettings.theme.type,
            datesLocale: allSettings.theme.datesLocale,
            sidebarOpen: allSettings.theme.sidebarOpen,
            showTrayIcon: allSettings.system.showTrayIcon,
            minimizeToTray: allSettings.system.minimizeToTray,
            startInTray: allSettings.system.startInTray,
            startWithSystem: allSettings.system.startWithSystem,
            updateCheckAutomatically: allSettings.updater.updateCheckAutomatically,
            updateDownloadAutomatically: allSettings.updater.updateDownloadAutomatically,
            updateInstallAutomatically: allSettings.updater.updateInstallAutomatically
        }
    }
}

// Initialize the model
SettingsModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // Theme settings
        themeType: {
            type: DataTypes.ENUM('light', 'dark', 'system'),
            allowNull: false,
            defaultValue: 'system'
        },
        sidebarOpen: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        showTrayIcon: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        minimizeToTray: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        startInTray: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        startWithSystem: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        datesLocale: {
            type: DataTypes.ENUM('nl-NL', 'us-US'),
            allowNull: false,
            defaultValue: 'nl-NL'
        },
        // Update settings
        updateCheckAutomatically: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        updateDownloadAutomatically: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        updateInstallAutomatically: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        sequelize,
        modelName: 'Settings',
        tableName: 'settings'
    }
)

export { SettingsModel }

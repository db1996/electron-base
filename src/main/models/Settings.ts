import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../database'
import { AllSettings } from '../types/settings/AllSettings'

// Define the attributes for the Settings model
interface SettingsAttributes {
    id: number
    // Theme settings
    themeType: 'light' | 'dark' | 'system'
    sidebarOpen: boolean
    showTrayIcon: boolean
    minimizeToTray: boolean
    startInTray: boolean
    startWithSystem: boolean
    datesLocale: 'nl-NL' | 'us-US'
    // Update settings
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
    declare sidebarOpen: boolean
    declare showTrayIcon: boolean
    declare minimizeToTray: boolean
    declare startInTray: boolean
    declare startWithSystem: boolean
    declare datesLocale: 'nl-NL' | 'us-US'
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
                sidebarOpen: this.sidebarOpen !== undefined ? this.sidebarOpen : true,
                showTrayIcon: this.showTrayIcon !== undefined ? this.showTrayIcon : false,
                minimizeToTray: this.minimizeToTray !== undefined ? this.minimizeToTray : false,
                startInTray: this.startInTray !== undefined ? this.startInTray : false,
                startWithSystem: this.startWithSystem !== undefined ? this.startWithSystem : false,
                datesLocale: this.datesLocale || 'nl-NL'
            },
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

    // Static method to create from AllSettings format
    public static fromAllSettings(allSettings: AllSettings): SettingsCreationAttributes {
        return {
            themeType: allSettings.theme.type,
            sidebarOpen: allSettings.theme.sidebarOpen,
            showTrayIcon: allSettings.theme.showTrayIcon,
            minimizeToTray: allSettings.theme.minimizeToTray,
            startInTray: allSettings.theme.startInTray,
            startWithSystem: allSettings.theme.startWithSystem,
            datesLocale: allSettings.theme.datesLocale,
            updateCheckAutomatically: allSettings.updateCheckAutomatically,
            updateDownloadAutomatically: allSettings.updateDownloadAutomatically,
            updateInstallAutomatically: allSettings.updateInstallAutomatically
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

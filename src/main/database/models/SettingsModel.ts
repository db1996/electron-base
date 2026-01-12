import { Model, Optional } from 'sequelize'
import {
    AllSettings,
    FlatSettingsAttributes,
    SettingsSchemaGenerator,
    sequelizeAttributes
} from '../schemas/settingsSchema'

export interface SettingsCreationAttributes
    extends Optional<FlatSettingsAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

/**
 * Settings Model - Generated from unified schema
 * No more manual field declarations or conversion methods!
 */
export class SettingsModel
    extends Model<FlatSettingsAttributes, SettingsCreationAttributes>
    implements FlatSettingsAttributes
{
    declare id: number
    declare themeType: FlatSettingsAttributes['themeType']
    declare themeDatesLocale: FlatSettingsAttributes['themeDatesLocale']
    declare themeSidebarOpen: FlatSettingsAttributes['themeSidebarOpen']
    declare systemShowTrayIcon: FlatSettingsAttributes['systemShowTrayIcon']
    declare systemMinimizeToTray: FlatSettingsAttributes['systemMinimizeToTray']
    declare systemStartInTray: FlatSettingsAttributes['systemStartInTray']
    declare systemStartWithSystem: FlatSettingsAttributes['systemStartWithSystem']
    declare updaterCheckAutomatically: FlatSettingsAttributes['updaterCheckAutomatically']
    declare updaterDownloadAutomatically: FlatSettingsAttributes['updaterDownloadAutomatically']
    declare updaterInstallAutomatically: FlatSettingsAttributes['updaterInstallAutomatically']
    declare readonly createdAt: Date
    declare readonly updatedAt: Date

    /**
     * Convert model to AllSettings format
     * Uses the generated converter - no manual mapping!
     */
    toAllSettings(): AllSettings {
        return SettingsSchemaGenerator.fromFlatFormat(this.get())
    }

    /**
     * Create model data from AllSettings format
     * Uses the generated converter - no manual mapping!
     */
    static fromAllSettings(allSettings: AllSettings): SettingsCreationAttributes {
        return SettingsSchemaGenerator.toFlatFormat(allSettings)
    }
}

/**
 * Initialize model - uses generated Sequelize attributes
 */
export function initializeSettingsModel(sequelize: any): void {
    SettingsModel.init(sequelizeAttributes, {
        sequelize,
        modelName: 'Settings',
        tableName: 'settings'
    })
}

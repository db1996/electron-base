// Re-export types and schemas from the unified schema generator
export type {
    ThemeSettings,
    SystemSettings,
    UpdaterSettings,
    AllSettings
} from '../../database/schemas/settingsSchema'

export {
    AllSettingsYupSchema,
    ThemeYupSchema,
    SystemSettingsYupSchema,
    UpdaterSettingsYupSchema,
    defaultSettings
} from '../../database/schemas/settingsSchema'

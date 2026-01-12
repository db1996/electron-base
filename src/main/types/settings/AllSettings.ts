import { ThemeSettings, ThemeYupSchema } from './ThemeSettings'
import { SystemSettings, SystemSettingsYupSchema } from './SystemSettings'
import { UpdaterSettings, UpdaterSettingsYupSchema } from './UpdaterSettings'
import * as yup from 'yup'

export type AllSettings = {
    theme: ThemeSettings
    system: SystemSettings
    updater: UpdaterSettings
}

export const AllSettingsYupSchema = yup.object({
    theme: ThemeYupSchema.default(() => ThemeYupSchema.cast({})),
    system: SystemSettingsYupSchema.default(() => SystemSettingsYupSchema.cast({})),
    updater: UpdaterSettingsYupSchema.default(() => UpdaterSettingsYupSchema.cast({}))
}) as yup.Schema<AllSettings>

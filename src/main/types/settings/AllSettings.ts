import { ThemeSettings, ThemeYupSchema } from './ThemeSettings'
import * as yup from 'yup'

export type AllSettings = {
    theme: ThemeSettings
    updateCheckAutomatically: boolean
    updateDownloadAutomatically: boolean
    updateInstallAutomatically: boolean
}

export const AllSettingsYupSchema = yup.object({
    theme: ThemeYupSchema.default(() => ThemeYupSchema.cast({})),
    updateCheckAutomatically: yup.boolean().default(true),
    updateDownloadAutomatically: yup.boolean().default(false),
    updateInstallAutomatically: yup.boolean().default(false)
}) as yup.Schema<AllSettings>

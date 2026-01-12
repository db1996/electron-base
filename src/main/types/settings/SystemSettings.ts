import * as yup from 'yup'

export type SystemSettings = {
    showTrayIcon: boolean
    minimizeToTray: boolean
    startInTray: boolean
    startWithSystem: boolean
}

export const SystemSettingsYupSchema: yup.Schema<SystemSettings> = yup.object({
    showTrayIcon: yup.boolean().default(false),
    minimizeToTray: yup.boolean().default(false),
    startInTray: yup.boolean().default(false),
    startWithSystem: yup.boolean().default(false)
})

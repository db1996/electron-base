import * as yup from 'yup'

export type ThemeSettings = {
    type: 'light' | 'dark' | 'system'
    sidebarOpen: boolean
    showTrayIcon: boolean
    minimizeToTray: boolean
    startInTray: boolean
    startWithSystem: boolean
    datesLocale: 'nl-NL' | 'us-US'
}

export const ThemeYupSchema: yup.Schema<ThemeSettings> = yup.object({
    type: yup.string().oneOf(['light', 'dark', 'system']).default('system'),
    sidebarOpen: yup.boolean().default(true),
    showTrayIcon: yup.boolean().default(false),
    minimizeToTray: yup.boolean().default(false),
    startInTray: yup.boolean().default(false),
    startWithSystem: yup.boolean().default(false),
    datesLocale: yup.string().oneOf(['nl-NL', 'us-US']).default('nl-NL')
})

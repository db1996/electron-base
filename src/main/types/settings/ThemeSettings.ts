import * as yup from 'yup'

export type ThemeSettings = {
    type: 'light' | 'dark' | 'system'
    datesLocale: 'nl-NL' | 'us-US'
    sidebarOpen: boolean
}

export const ThemeYupSchema: yup.Schema<ThemeSettings> = yup.object({
    type: yup.string().oneOf(['light', 'dark', 'system']).default('system'),
    datesLocale: yup.string().oneOf(['nl-NL', 'us-US']).default('nl-NL'),
    sidebarOpen: yup.boolean().default(true)
})

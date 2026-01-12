import * as yup from 'yup'

export type UpdaterSettings = {
    updateCheckAutomatically: boolean
    updateDownloadAutomatically: boolean
    updateInstallAutomatically: boolean
}

export const UpdaterSettingsYupSchema: yup.Schema<UpdaterSettings> = yup.object({
    updateCheckAutomatically: yup.boolean().default(true),
    updateDownloadAutomatically: yup.boolean().default(false),
    updateInstallAutomatically: yup.boolean().default(false)
})

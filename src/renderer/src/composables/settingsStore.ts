import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { AllSettings } from '@main/types/settings/AllSettings'
import { debounce } from 'lodash'
import { toast } from 'vue-sonner'

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref<AllSettings | null>(null)

    let activeSettingsPromise: Promise<AllSettings> | null = null

    const form = ref<AllSettings | null>(null)
    const formErrors = ref<Record<string, string>>({})
    const formInitialized = ref(false)
    const formIsSaving = ref(false)

    async function init() {
        console.trace('init settings')

        await getSettings()

        form.value = settings.value
        formInitialized.value = true
    }

    async function getSettings(): Promise<AllSettings> {
        if (!activeSettingsPromise && window.api) {
            activeSettingsPromise = window.api.getAllSettings()
            settings.value = await activeSettingsPromise
            activeSettingsPromise = null
            form.value = settings.value
            console.log('Settings loaded:', settings.value)
        }

        if (!settings.value) {
            return Promise.reject('Settings not loaded')
        } else {
            return settings.value
        }
    }

    async function saveSettings(newSettings: AllSettings) {
        settings.value = JSON.parse(JSON.stringify(newSettings))

        await window.api?.saveAllSettings(JSON.parse(JSON.stringify(newSettings)))
    }

    async function savePartialSettings(partialSettings: Partial<AllSettings>) {
        const updatedSettings = { ...settings.value, ...partialSettings } as AllSettings
        await saveSettings(updatedSettings)

        form.value = updatedSettings
    }

    window.api?.reloadSettings(async () => {
        console.log('reload requested from back-end')

        await getSettings()
    })

    async function saveSettingsForm() {
        if (!form.value) {
            console.error('⚠️ Form is null or undefined before validation!')
            return
        }

        formIsSaving.value = true

        try {
            await saveSettings(form.value)
            formErrors.value = {}
            formIsSaving.value = false
        } catch (err: any) {
            if (err.inner) {
                console.error('Validation errors:', err.inner)
                formErrors.value = err.inner.reduce((acc: Record<string, string>, error) => {
                    acc[error.path] = error.message
                    return acc
                }, {})
                formIsSaving.value = false
            }
        }
    }

    const debounceTime = 3000
    const remainingTimeSaveSettings = ref(0)
    const flashSavedIndicator = ref(false)
    let countdownInterval: number | null = null

    const debounceSaveSettingForm = debounce(async () => {
        clearCountdown()
        remainingTimeSaveSettings.value = 0

        await saveSettingsForm()
        toast('Settings saved!', {
            duration: 1200,
            closeButton: true
        })

        flashSavedIndicator.value = true
        setTimeout(() => {
            flashSavedIndicator.value = false
        }, 500)
    }, debounceTime)

    function clearCountdown() {
        if (countdownInterval !== null) {
            clearInterval(countdownInterval)
            countdownInterval = null
        }
    }

    async function saveSettingsFormDebounce() {
        clearCountdown()
        remainingTimeSaveSettings.value = debounceTime
        const start = Date.now()

        countdownInterval = window.setInterval(() => {
            const elapsed = Date.now() - start
            const remaining = Math.max(debounceTime - elapsed, 0)
            remainingTimeSaveSettings.value = remaining

            // stop interval when done
            if (remaining === 0) clearCountdown()
        }, 16) // ~60fps smoothness

        debounceSaveSettingForm()
    }

    async function fireDebounceNow() {
        clearCountdown()
        remainingTimeSaveSettings.value = debounceTime
        debounceSaveSettingForm()
        debounceSaveSettingForm.flush()
    }

    return {
        // Core functions
        init,
        getSettings,

        // State
        settings,
        form,
        errors: formErrors,
        formInitialized,
        formIsSaving,

        // Save functions (only expose what's needed)
        savePartialSettings,
        saveSettingsFormDebounce,
        fireDebounceNow,

        // UI state
        flashSavedIndicator,
        remainingTimeSaveSettings,
        debounceTime
    }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))

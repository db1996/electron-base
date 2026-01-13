import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { debounce } from 'lodash'
import { toast } from 'vue-sonner'
import router from '@renderer/router/router'

export interface Option {
    key: string
    value: string
}

export const useOptionsStore = defineStore('options', () => {
    const allPptions = ref<Record<string, string>>({})
    const isLoading = ref(false)
    const isInitialized = ref(false)

    const tutorialStatus = ref({
        completed: false,
        step: 1
    })

    /**
     * Initialize the options store by loading all options
     */
    async function init() {
        if (isInitialized.value) return

        console.log('Initializing options store')
        await loadAllOptions()

        tutorialStatus.value.completed = (await getBool('setupCompleted', false)) || false
        tutorialStatus.value.step = (await getNumber('setupStep', 1)) || 1

        console.log('Tutorial status:', tutorialStatus.value)

        isInitialized.value = true
    }

    /**
     * Load all options from the backend
     */
    async function loadAllOptions() {
        if (!window.api) return

        isLoading.value = true
        try {
            const allOptions = await window.api.optionsGetAll()
            allPptions.value = allOptions
            console.log('Options loaded:', allOptions)
        } catch (error) {
            console.error('Failed to load options:', error)
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Get an option value (string)
     */
    async function get(key: string, defaultValue?: string): Promise<string | null> {
        if (!window.api) return defaultValue || null

        try {
            const value = await window.api.optionsGet(key, defaultValue)
            if (value !== null) {
                allPptions.value[key] = value
            }
            return value
        } catch (error) {
            console.error(`Failed to get option '${key}':`, error)
            return defaultValue || null
        }
    }

    /**
     * Set an option value (string)
     */
    async function set(key: string, value: string): Promise<boolean> {
        if (!window.api) return false

        try {
            const success = await window.api.optionsSet(key, value)
            if (success) {
                allPptions.value[key] = value
            }
            return success
        } catch (error) {
            console.error(`Failed to set option '${key}':`, error)
            return false
        }
    }

    /**
     * Get a boolean option value
     */
    async function getBool(key: string, defaultValue: boolean = false): Promise<boolean> {
        if (!window.api) return defaultValue

        try {
            const value = await window.api.optionsGetBool(key, defaultValue)
            allPptions.value[key] = value.toString()
            return value
        } catch (error) {
            console.error(`Failed to get boolean option '${key}':`, error)
            return defaultValue
        }
    }

    /**
     * Set a boolean option value
     */
    async function setBool(key: string, value: boolean): Promise<boolean> {
        if (!window.api) return false

        try {
            const success = await window.api.optionsSetBool(key, value)
            if (success) {
                allPptions.value[key] = value.toString()
            }
            return success
        } catch (error) {
            console.error(`Failed to set boolean option '${key}':`, error)
            return false
        }
    }

    /**
     * Get a number option value
     */
    async function getNumber(key: string, defaultValue: number = 0): Promise<number> {
        if (!window.api) return defaultValue

        try {
            const value = await window.api.optionsGetNumber(key, defaultValue)
            allPptions.value[key] = value.toString()
            return value
        } catch (error) {
            console.error(`Failed to get number option '${key}':`, error)
            return defaultValue
        }
    }

    /**
     * Set a number option value
     */
    async function setNumber(key: string, value: number): Promise<boolean> {
        if (!window.api) return false

        try {
            const success = await window.api.optionsSetNumber(key, value)
            if (success) {
                allPptions.value[key] = value.toString()
            }
            return success
        } catch (error) {
            console.error(`Failed to set number option '${key}':`, error)
            return false
        }
    }

    /**
     * Delete an option
     */
    async function deleteOption(key: string): Promise<boolean> {
        if (!window.api) return false

        try {
            const success = await window.api.optionsDelete(key)
            if (success) {
                delete allPptions.value[key]
            }
            return success
        } catch (error) {
            console.error(`Failed to delete option '${key}':`, error)
            return false
        }
    }

    /**
     * Check if an option exists
     */
    async function has(key: string): Promise<boolean> {
        if (!window.api) return false

        try {
            return await window.api.optionsHas(key)
        } catch (error) {
            console.error(`Failed to check if option '${key}' exists:`, error)
            return false
        }
    }

    /**
     * Get the reactive options object (for templates)
     */
    function getReactiveOptions() {
        return allPptions
    }

    /**
     * Get a reactive computed value for a specific option
     */
    function getReactiveOption(key: string, defaultValue: string = '') {
        return ref({
            get: () => allPptions.value[key] || defaultValue,
            set: async (value: string) => {
                await set(key, value)
            }
        })
    }

    /**
     * Debounced set function for form inputs to avoid too many saves
     */
    const debouncedSet = debounce(async (key: string, value: string) => {
        const success = await set(key, value)
        if (success) {
            toast('Option saved!', {
                duration: 1000,
                closeButton: false
            })
        }
    }, 1000)

    /**
     * Set with debouncing (useful for form inputs)
     */
    function setDebounced(key: string, value: string) {
        // Update local state immediately for reactivity
        allPptions.value[key] = value
        // Debounce the actual save
        debouncedSet(key, value)
    }

    /**
     * Flush debounced saves immediately
     */
    function flushDebounced() {
        debouncedSet.flush()
    }

    return {
        // State
        options: getReactiveOptions(),
        tutorialStatus,
        isLoading,
        isInitialized,

        // Core functions
        init,
        loadAllOptions,

        // String functions
        get,
        set,
        setDebounced,
        flushDebounced,

        // Boolean functions
        getBool,
        setBool,

        // Number functions
        getNumber,
        setNumber,

        // Utility functions
        deleteOption,
        has,
        getReactiveOption
    }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useOptionsStore, import.meta.hot))

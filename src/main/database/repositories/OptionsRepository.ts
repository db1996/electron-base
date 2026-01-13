import { OptionsModel } from '../models/OptionsModel'
import { OptionsYupSchema } from '../schemas/optionsSchema'

/**
 * Repository pattern for Options data access
 */
export class OptionsRepository {
    private static _instance: OptionsRepository

    private constructor() {}

    public static getInstance(): OptionsRepository {
        if (!OptionsRepository._instance) {
            OptionsRepository._instance = new OptionsRepository()
        }
        return OptionsRepository._instance
    }

    /**
     * Get an option by key
     */
    async getOption(key: string): Promise<string | null> {
        try {
            const option = await OptionsModel.findOne({ where: { key } })
            return option?.value || null
        } catch (error) {
            console.error(`Error retrieving option '${key}':`, error)
            return null
        }
    }

    /**
     * Set an option value
     */
    async setOption(key: string, value: string): Promise<boolean> {
        try {
            const validated = await OptionsYupSchema.validate(
                { key, value },
                {
                    stripUnknown: true,
                    abortEarly: false
                }
            )

            await OptionsModel.upsert({
                key: validated.key,
                value: validated.value
            })

            return true
        } catch (error) {
            console.error(`Error setting option '${key}':`, error)
            return false
        }
    }

    /**
     * Delete an option
     */
    async deleteOption(key: string): Promise<boolean> {
        try {
            const deletedCount = await OptionsModel.destroy({ where: { key } })
            return deletedCount > 0
        } catch (error) {
            console.error(`Error deleting option '${key}':`, error)
            return false
        }
    }

    /**
     * Get all options
     */
    async getAllOptions(): Promise<Record<string, string>> {
        try {
            const options = await OptionsModel.findAll()
            const result: Record<string, string> = {}

            for (const option of options) {
                result[option.key] = option.value
            }

            return result
        } catch (error) {
            console.error('Error retrieving all options:', error)
            return {}
        }
    }

    /**
     * Check if an option exists
     */
    async hasOption(key: string): Promise<boolean> {
        try {
            const count = await OptionsModel.count({ where: { key } })
            return count > 0
        } catch (error) {
            console.error(`Error checking if option '${key}' exists:`, error)
            return false
        }
    }
}

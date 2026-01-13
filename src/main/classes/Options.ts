import { OptionsRepository } from '../database/repositories/OptionsRepository'

/**
 * Simple static helper class for options management
 * Usage: Options.set('key', 'value') and Options.get('key')
 */
export class Options {
    private static repository = OptionsRepository.getInstance()

    /**
     * Set an option value
     * @param key The option key
     * @param value The option value
     * @returns Promise<boolean> Success status
     */
    static async set(key: string, value: string): Promise<boolean> {
        return await this.repository.setOption(key, value)
    }

    /**
     * Get an option value
     * @param key The option key
     * @param defaultValue Optional default value if key doesn't exist
     * @returns Promise<string | null> The option value or null/default
     */
    static async get(key: string, defaultValue: string | null = null): Promise<string | null> {
        const value = await this.repository.getOption(key)

        if (value === null && defaultValue !== null) {
            await this.set(key, defaultValue)
        }

        return value !== null ? value : defaultValue
    }

    /**
     * Delete an option
     * @param key The option key
     * @returns Promise<boolean> Success status
     */
    static async delete(key: string): Promise<boolean> {
        return await this.repository.deleteOption(key)
    }

    /**
     * Check if an option exists
     * @param key The option key
     * @returns Promise<boolean> Whether the option exists
     */
    static async has(key: string): Promise<boolean> {
        return await this.repository.hasOption(key)
    }

    /**
     * Get all options as a key-value object
     * @returns Promise<Record<string, string>> All options
     */
    static async getAll(): Promise<Record<string, string>> {
        return await this.repository.getAllOptions()
    }

    /**
     * Convenience method to get a boolean option
     * @param key The option key
     * @param defaultValue Default boolean value
     * @returns Promise<boolean>
     */
    static async getBool(key: string, defaultValue: boolean = false): Promise<boolean> {
        const value = await this.get(key)
        console.log(`get ${key}: ${value}`)
        if (value === null) {
            this.setBool(key, defaultValue)
            return defaultValue
        }
        return value.toLowerCase() === 'true'
    }

    /**
     * Convenience method to set a boolean option
     * @param key The option key
     * @param value The boolean value
     * @returns Promise<boolean> Success status
     */
    static async setBool(key: string, value: boolean): Promise<boolean> {
        return await this.set(key, value.toString())
    }

    /**
     * Convenience method to get a number option
     * @param key The option key
     * @param defaultValue Default number value
     * @returns Promise<number>
     */
    static async getNumber(key: string, defaultValue: number = 0): Promise<number> {
        const value = await this.get(key)
        if (value === null) {
            this.setNumber(key, defaultValue)
            return defaultValue
        }
        const parsed = parseFloat(value)

        return isNaN(parsed) ? defaultValue : parsed
    }

    /**
     * Convenience method to set a number option
     * @param key The option key
     * @param value The number value
     * @returns Promise<boolean> Success status
     */
    static async setNumber(key: string, value: number): Promise<boolean> {
        return await this.set(key, value.toString())
    }
}

/**
 * Simple test to verify SQLite settings migration works
 * This file can be removed after testing
 */

import { initializeDatabase, closeDatabase } from '../database'
import { SettingsModel } from '../models/Settings'
import { runMigrations } from '../migrations/runner'
import { AllSettingsYupSchema } from '../types/settings/AllSettings'

export async function testSettingsDatabase(): Promise<void> {
    try {
        console.log('Testing SQLite settings database...')

        // Initialize database
        await initializeDatabase()
        await runMigrations()

        // Test creating default settings
        const defaultSettings = AllSettingsYupSchema.cast({})
        console.log('Default settings:', defaultSettings)

        // Create settings record
        const settingsRecord = await SettingsModel.create(
            SettingsModel.fromAllSettings(defaultSettings)
        )
        console.log('Created settings record:', settingsRecord.toAllSettings())

        // Test updating
        await settingsRecord.update({
            themeType: 'dark',
            sidebarOpen: false
        })
        console.log('Updated settings:', settingsRecord.toAllSettings())

        // Test finding
        const foundRecord = await SettingsModel.findOne()
        console.log('Found settings:', foundRecord?.toAllSettings())

        // Clean up test data
        await SettingsModel.destroy({ where: {} })

        await closeDatabase()
        console.log('✅ Settings database test passed!')
    } catch (error) {
        console.error('❌ Settings database test failed:', error)
        throw error
    }
}

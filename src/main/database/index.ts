import { Sequelize } from 'sequelize'
import { app } from 'electron'
import path from 'node:path'
import fs from 'fs'

// Initialize Sequelize with SQLite
const databasePath = path.join(app.getPath('userData'), 'settings.sqlite')
const databaseDir = path.dirname(databasePath)

// Ensure the database directory exists
if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, { recursive: true })
}

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: databasePath,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
        timestamps: true, // Adds createdAt and updatedAt
        underscored: false // Use camelCase instead of snake_case
    }
})

// Test the connection
export async function initializeDatabase(): Promise<void> {
    try {
        // Import models to ensure they're registered
        await import('../models')

        await sequelize.authenticate()
        console.log('Database connection has been established successfully.')

        // Sync all models (create tables if they don't exist)
        await sequelize.sync()
        console.log('Database models synchronized.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
        throw error
    }
}

export async function closeDatabase(): Promise<void> {
    try {
        await sequelize.close()
        console.log('Database connection closed.')
    } catch (error) {
        console.error('Error closing database:', error)
    }
}

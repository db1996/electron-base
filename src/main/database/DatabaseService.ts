import { Sequelize } from 'sequelize'
import { app } from 'electron'
import path from 'node:path'
import fs from 'fs'

/**
 * Centralized database service that handles all database operations
 * - Connection management
 * - Migration handling
 * - Model registration
 * - Transaction management
 */
export class DatabaseService {
    private static _instance: DatabaseService
    private _sequelize: Sequelize | null = null
    private _initialized = false

    private constructor() {}

    public static getInstance(): DatabaseService {
        if (!DatabaseService._instance) {
            DatabaseService._instance = new DatabaseService()
        }
        return DatabaseService._instance
    }

    public get sequelize(): Sequelize {
        if (!this._sequelize) {
            throw new Error('Database not initialized')
        }
        return this._sequelize
    }

    /**
     * Initialize database connection and run setup
     */
    public async initialize(): Promise<void> {
        if (this._initialized) return

        try {
            // Setup database connection
            const databasePath = path.join(app.getPath('userData'), 'app.sqlite')
            const databaseDir = path.dirname(databasePath)

            if (!fs.existsSync(databaseDir)) {
                fs.mkdirSync(databaseDir, { recursive: true })
            }

            this._sequelize = new Sequelize({
                dialect: 'sqlite',
                storage: databasePath,
                logging: process.env.NODE_ENV === 'development' ? console.log : false,
                define: {
                    timestamps: true,
                    underscored: false
                }
            })

            // Test connection
            await this._sequelize.authenticate()
            console.log('Database connection established successfully.')

            await this.registerModels()

            await this._sequelize.sync({ alter: true })
            console.log('Database models synchronized.')

            this._initialized = true
        } catch (error) {
            console.error('Failed to initialize database:', error)
            throw error
        }
    }

    /**
     * Register all models
     */
    private async registerModels(): Promise<void> {
        // Initialize all models with the sequelize instance
        const { initializeSettingsModel, initializeOptionsModel } = await import('./models')
        initializeSettingsModel(this._sequelize!)
        initializeOptionsModel(this._sequelize!)
    }

    /**
     * Create a database transaction
     */
    public async transaction<T>(callback: (transaction: any) => Promise<T>): Promise<T> {
        return await this._sequelize!.transaction(callback)
    }

    /**
     * Close database connection
     */
    public async close(): Promise<void> {
        if (this._sequelize) {
            await this._sequelize.close()
            this._sequelize = null
            this._initialized = false
            console.log('Database connection closed.')
        }
    }
}

// Export singleton instance
export const databaseService = DatabaseService.getInstance()

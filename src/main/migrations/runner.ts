import { QueryInterface } from 'sequelize'
import { sequelize } from '../database'
import migration001 from './001_create_settings'
import migration002 from './002_add_more_settings_1'

interface Migration {
    up: (queryInterface: QueryInterface) => Promise<void>
    down: (queryInterface: QueryInterface) => Promise<void>
}

const migrations: { [key: string]: Migration } = {
    '001_create_settings': migration001,
    '002_add_more_settings_1': migration002
}

export async function runMigrations(): Promise<void> {
    const queryInterface = sequelize.getQueryInterface()

    // Create migrations table if it doesn't exist
    try {
        await queryInterface.createTable('SequelizeMeta', {
            name: {
                type: 'VARCHAR(255)',
                primaryKey: true
            }
        })
    } catch (error) {
        // Table might already exist, ignore error
    }

    // Check which migrations have been run
    const [executedMigrations] = (await sequelize.query(
        'SELECT name FROM SequelizeMeta ORDER BY name'
    )) as [Array<{ name: string }>, unknown]

    const executedMigrationNames = executedMigrations.map((m) => m.name)

    // Run pending migrations
    for (const [migrationName, migration] of Object.entries(migrations)) {
        if (!executedMigrationNames.includes(migrationName)) {
            console.log(`Running migration: ${migrationName}`)
            try {
                await migration.up(queryInterface)

                // Mark migration as executed
                await sequelize.query('INSERT INTO SequelizeMeta (name) VALUES (?)', {
                    replacements: [migrationName]
                })

                console.log(`Migration ${migrationName} completed successfully`)
            } catch (error) {
                console.error(`Migration ${migrationName} failed:`, error)
                throw error
            }
        }
    }
}

import { DataTypes, QueryInterface } from 'sequelize'
import { sequelizeAttributes } from '../schemas/settingsSchema'

/**
 * Migration auto-generated from unified schema
 * No more manual field declarations in migrations!
 */
export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        const attributes = { ...sequelizeAttributes }

        // Add timestamps to migration
        attributes.createdAt = {
            type: DataTypes.DATE,
            allowNull: false
        }
        attributes.updatedAt = {
            type: DataTypes.DATE,
            allowNull: false
        }

        await queryInterface.createTable('settings', attributes)
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('settings')
    }
}

import { DataTypes, QueryInterface } from 'sequelize'
import { sequelizeAttributes } from '../schemas/optionsSchema'

/**
 * Migration for options table
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

        await queryInterface.createTable('options', attributes)
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('options')
    }
}

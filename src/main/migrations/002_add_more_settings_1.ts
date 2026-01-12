import { QueryInterface, DataTypes } from 'sequelize'

export default {
    up: async (queryInterface: QueryInterface): Promise<void> => {
        await queryInterface.addColumn('settings', 'startInTray', {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        })
        await queryInterface.addColumn('settings', 'startWithSystem', {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        })
    },

    down: async (queryInterface: QueryInterface): Promise<void> => {
        await queryInterface.removeColumn('settings', 'startInTray')
        await queryInterface.removeColumn('settings', 'startWithSystem')
    }
}

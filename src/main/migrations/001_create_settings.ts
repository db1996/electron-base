import { QueryInterface, DataTypes } from 'sequelize'

export default {
    up: async (queryInterface: QueryInterface): Promise<void> => {
        await queryInterface.createTable('settings', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            themeType: {
                type: DataTypes.ENUM('light', 'dark', 'system'),
                allowNull: false,
                defaultValue: 'system'
            },
            sidebarOpen: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            showTrayIcon: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            minimizeToTray: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            startInTray: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            startWithSystem: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            datesLocale: {
                type: DataTypes.ENUM('nl-NL', 'us-US'),
                allowNull: false,
                defaultValue: 'nl-NL'
            },
            updateCheckAutomatically: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            updateDownloadAutomatically: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            updateInstallAutomatically: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            }
        })
    },

    down: async (queryInterface: QueryInterface): Promise<void> => {
        await queryInterface.dropTable('settings')
    }
}

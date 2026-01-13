import { DataTypes, ModelAttributes } from 'sequelize'
import * as yup from 'yup'

/**
 * Simple key-value options schema for general app settings
 */

// TypeScript types for options
export type OptionsAttributes = {
    id: number
    key: string
    value: string
    createdAt: Date
    updatedAt: Date
}

export type OptionsCreationAttributes = Omit<OptionsAttributes, 'id' | 'createdAt' | 'updatedAt'>

// Sequelize model attributes
export const sequelizeAttributes: ModelAttributes<OptionsAttributes> = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [1, 255]
        }
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    }
}

// Yup validation schema
export const OptionsYupSchema = yup.object({
    key: yup.string().required().min(1).max(255),
    value: yup.string().nullable().default(null)
})

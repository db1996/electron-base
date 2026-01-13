import { Model, Optional } from 'sequelize'
import {
    OptionsAttributes,
    OptionsCreationAttributes,
    sequelizeAttributes
} from '../schemas/optionsSchema'

export interface OptionsCreationAttributesOptional
    extends Optional<OptionsAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

/**
 * Options Model for key-value storage
 */
export class OptionsModel
    extends Model<OptionsAttributes, OptionsCreationAttributesOptional>
    implements OptionsAttributes
{
    declare id: number
    declare key: string
    declare value: string
    declare readonly createdAt: Date
    declare readonly updatedAt: Date
}

/**
 * Initialize options model
 */
export function initializeOptionsModel(sequelize: any): void {
    OptionsModel.init(sequelizeAttributes, {
        sequelize,
        modelName: 'Options',
        tableName: 'options'
    })
}

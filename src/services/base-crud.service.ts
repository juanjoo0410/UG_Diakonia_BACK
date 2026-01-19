import { Model, FindOptions, ModelStatic, WhereOptions } from 'sequelize';

export abstract class BaseCRUDService<T extends Model> {
    protected readonly ModelClass: ModelStatic<T>;

    constructor(ModelClass: ModelStatic<T>) {
        this.ModelClass = ModelClass;
    }

    public async getAll(options?: FindOptions<T>): Promise<T[]> {
        return this.ModelClass.findAll(options);
    }

    public async getById(id: number | string): Promise<T | null> {
        return this.ModelClass.findByPk(id as any);
    }

    public async countActive(): Promise<number | 0> {
        const where: WhereOptions = {};
        const attributes = this.ModelClass.getAttributes();

        if (attributes['estado']) { where['estado'] = true;}
        if (attributes['anulado']) { where['anulado'] = false; }

        const total = await this.ModelClass.count({ where });
        return total;
    }
}
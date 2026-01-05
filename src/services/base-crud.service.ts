import { Model, FindOptions, ModelStatic } from 'sequelize';

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
}
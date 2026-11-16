import {DeleteResult, HydratedDocument, Model, QueryFilter, QueryOptions} from "mongoose";

export abstract class AbstractRepository <T> {
    protected constructor(private readonly model: Model<T>) {
    }

    async create(data: Partial<T>):Promise<HydratedDocument<T>>{
       return this.model.create(data)
    }

    async update(filter:QueryFilter <T> , newData:Partial<T>,options?:QueryOptions):Promise<HydratedDocument<T> | null>{
        return this.model.findOneAndUpdate(filter,newData,options);
    }
    async delete(filter:QueryFilter<T>):Promise<DeleteResult>{
        return this.model.deleteOne(filter);
    }
    async findOne(filter:QueryFilter<T>):Promise<HydratedDocument<T> | null>{
        return this.model.findOne(filter);
    }

}
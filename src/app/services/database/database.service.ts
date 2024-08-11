import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class DatabaseService {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource
    ){}

    async executeProcedure(procedureName: string, parameters: any[]): Promise<any> {
        return this.dataSource.query(
            `CALL ${procedureName}(${parameters.map(() => "?").join(", ")})`,
            parameters
        );
    }
}
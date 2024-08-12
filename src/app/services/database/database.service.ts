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
        const sanitizedParams = parameters.map(param => 
            param === null || param === undefined ? null : param
        );

        return this.dataSource.query(
            `CALL ${procedureName}(${sanitizedParams.map(() => "?").join(", ")})`,
            sanitizedParams
        );
    }
}
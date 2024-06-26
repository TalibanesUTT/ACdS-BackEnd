import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
    TableIndex,
} from "typeorm";

export class CreateCarModelsTable1718384618378 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "CarModels",
                columns: [
                    new TableColumn({
                        name: "id",
                        type: "bigint",
                        isPrimary: true,
                        isNullable: false,
                        isGenerated: true,
                        generationStrategy: "increment",
                        unsigned: true,
                    }),
                    new TableColumn({
                        name: "model",
                        type: "nvarchar",
                        length: "100",
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: "brand_id",
                        type: "int",
                        isNullable: false,
                        unsigned: true,
                    }),
                ],
            }),
        );

        await queryRunner.createForeignKey(
            "CarModels",
            new TableForeignKey({
                name: "fk_car_models_brand",
                columnNames: ["brand_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "CarBrands",
            }),
        );

        await queryRunner.createIndex(
            "CarModels",
            new TableIndex({
                name: "idx_model_model",
                columnNames: ["model", "brand_id"],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("CarModels");
    }
}

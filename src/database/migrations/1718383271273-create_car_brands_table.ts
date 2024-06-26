import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableIndex,
} from "typeorm";

export class CreateCarBrandsTable1718383271273 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "CarBrands",
                columns: [
                    new TableColumn({
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isNullable: false,
                        isGenerated: true,
                        generationStrategy: "increment",
                        unsigned: true,
                    }),
                    new TableColumn({
                        name: "brand",
                        type: "varchar",
                        length: "70",
                        isNullable: false,
                        isUnique: true,
                    }),
                ],
            }),
        );

        await queryRunner.createIndex(
            "CarBrands",
            new TableIndex({
                name: "idx_brand_brand",
                columnNames: ["brand"],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("CarBrands");
    }
}

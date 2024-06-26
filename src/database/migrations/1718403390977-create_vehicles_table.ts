import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
    TableIndex,
} from "typeorm";

export class CreateVehiclesTable1718403390977 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "Vehicles",
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
                        name: "owner_id",
                        type: "bigint",
                        isNullable: false,
                        unsigned: true,
                    }),
                    new TableColumn({
                        name: "serial_number",
                        type: "nvarchar",
                        length: "20",
                        isNullable: true,
                        isUnique: true,
                    }),
                    new TableColumn({
                        name: "model_id",
                        type: "bigint",
                        isNullable: false,
                        unsigned: true,
                    }),
                    new TableColumn({
                        name: "year",
                        type: "smallint",
                        isNullable: false,
                        unsigned: true,
                    }),
                    new TableColumn({
                        name: "color",
                        type: "varchar",
                        length: "25",
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: "plates",
                        type: "nvarchar",
                        length: "15",
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: "create_date",
                        type: "timestamp",
                        isNullable: false,
                        default: "now()",
                    }),
                ],
            }),
        );

        await queryRunner.createForeignKey(
            "Vehicles",
            new TableForeignKey({
                name: "fk_vehicle_owner",
                columnNames: ["owner_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "Users",
            }),
        );

        await queryRunner.createForeignKey(
            "Vehicles",
            new TableForeignKey({
                name: "fk_vehicle_model",
                columnNames: ["model_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "CarModels",
            }),
        );

        await queryRunner.createIndex(
            "Vehicles",
            new TableIndex({
                name: "idx_vehicle_serial_number",
                columnNames: ["serial_number"],
            }),
        );

        await queryRunner.createIndex(
            "Vehicles",
            new TableIndex({
                name: "idx_vehicle_year",
                columnNames: ["year"],
            }),
        );

        await queryRunner.createIndex(
            "Vehicles",
            new TableIndex({
                name: "idx_vehicle_color",
                columnNames: ["color"],
            }),
        );

        await queryRunner.createIndex(
            "Vehicles",
            new TableIndex({
                name: "idx_vehicle_plates",
                columnNames: ["plates"],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("Vehicles");
    }
}

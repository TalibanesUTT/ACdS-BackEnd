import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
    TableIndex,
} from "typeorm";

export class CreateServiceOrderTable1718408240994
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "ServiceOrders",
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
                        name: "file_number",
                        type: "nvarchar",
                        length: "15",
                        isNullable: false,
                        isUnique: true,
                    }),
                    new TableColumn({
                        name: "appointment_id",
                        type: "bigint",
                        isNullable: true,
                        unsigned: true,
                    }),
                    new TableColumn({
                        name: "vehicle_id",
                        type: "bigint",
                        isNullable: false,
                        unsigned: true,
                    }),
                    new TableColumn({
                        name: "initial_mileage",
                        type: "int",
                        isNullable: false,
                        unsigned: true,
                    }),
                    new TableColumn({
                        name: "notes",
                        type: "text",
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: "notify_to",
                        type: "nvarchar",
                        length: "100",
                        isNullable: true,
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
            "ServiceOrders",
            new TableForeignKey({
                name: "fk_service_order_appointment",
                columnNames: ["appointment_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "Appointments",
            }),
        );

        await queryRunner.createForeignKey(
            "ServiceOrders",
            new TableForeignKey({
                name: "fk_service_order_vehicle",
                columnNames: ["vehicle_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "Vehicles",
            }),
        );

        await queryRunner.createIndex(
            "ServiceOrders",
            new TableIndex({
                name: "idx_service_order_file_number",
                columnNames: ["file_number"],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("ServiceOrders");
    }
}

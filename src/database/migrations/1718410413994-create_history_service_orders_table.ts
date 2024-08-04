import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
    TableIndex,
} from "typeorm";

export class CreateHistoryServiceOrdersTable1718410413994
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "HistoryServiceOrders",
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
                        name: "service_order_id",
                        type: "bigint",
                        isNullable: false,
                        unsigned: true,
                    }),
                    new TableColumn({
                        name: "user_id",
                        type: "bigint",
                        isNullable: false,
                        unsigned: true,
                    }),
                    new TableColumn({
                        name: "status",
                        type: "varchar",
                        length: "35",
                        isNullable: false,
                        default: "'Recibido'",
                    }),
                    new TableColumn({
                        name: "comments",
                        type: "nvarchar",
                        length: "255",
                        isNullable: true,
                    }),
                    new TableColumn({
                        name: "rollback",
                        type: "boolean",
                        isNullable: false,
                        default: false,
                    }),
                    new TableColumn({
                        name: "time",
                        type: "timestamp",
                        isNullable: false,
                        default: "now()",
                    }),
                ],
            }),
        );

        await queryRunner.createForeignKey(
            "HistoryServiceOrders",
            new TableForeignKey({
                name: "fk_history_service_order_service_order",
                columnNames: ["service_order_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "ServiceOrders",
            }),
        );

        await queryRunner.createForeignKey(
            "HistoryServiceOrders",
            new TableForeignKey({
                name: "fk_history_service_order_user",
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "Users",
            }),
        );

        await queryRunner.createIndex(
            "HistoryServiceOrders",
            new TableIndex({
                name: "idx_history_service_order_status",
                columnNames: ["status"],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("HistoryServiceOrders");
    }
}

import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
    TableIndex,
} from "typeorm";

export class CreateUsersTable1718333607741 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "Users",
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
                        name: "name",
                        type: "varchar",
                        length: "60",
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: "last_name",
                        type: "varchar",
                        length: "60",
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: "email",
                        type: "nvarchar",
                        length: "100",
                        isNullable: false,
                        isUnique: true,
                    }),
                    new TableColumn({
                        name: "phone_number",
                        type: "nvarchar",
                        length: "10",
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: "password",
                        type: "nvarchar",
                        length: "100",
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: "verification_code",
                        type: "nvarchar",
                        length: "100",
                        isNullable: true,
                    }),
                    new TableColumn({
                        name: "email_confirmed",
                        type: "bit",
                        isNullable: false,
                        default: 0,
                    }),
                    new TableColumn({
                        name: "phone_confirmed",
                        type: "bit",
                        isNullable: false,
                        default: 0,
                    }),
                    new TableColumn({
                        name: "role_id",
                        type: "int",
                        isNullable: false,
                        unsigned: true,
                        default: 1,
                    }),
                    new TableColumn({
                        name: "active",
                        type: "bit",
                        isNullable: false,
                        default: 0,
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
            "Users",
            new TableForeignKey({
                name: "fk_user_role",
                columnNames: ["role_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "Roles",
            }),
        );

        await queryRunner.createIndex(
            "Users",
            new TableIndex({
                name: "idx_user_email",
                columnNames: ["email"],
            }),
        );

        await queryRunner.createIndex(
            "Users",
            new TableIndex({
                name: "idx_user_phone_number",
                columnNames: ["phone_number"],
            }),
        );

        await queryRunner.createIndex(
            "Users",
            new TableIndex({
                name: "idx_user_name",
                columnNames: ["name", "last_name"],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("Users");
    }
}

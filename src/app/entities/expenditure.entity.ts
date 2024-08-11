import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ExpenditureData } from "../interfaces/expenditure-data.interface";

@Entity({
    name: "Expenditures",
})
@Unique(["month", "year"])
@Index('idx_expenditure_month_year', ["month", "year"])

export class Expenditure {
    @PrimaryGeneratedColumn({
        unsigned: true,
    })
    id: number;

    @Column({
        type: "json",
        nullable: false,
    })
    data: ExpenditureData;

    @Column({
        type: "smallint",
        unsigned: true,
        nullable: false,
    })
    month: number;

    @Column({
        type: "smallint",
        unsigned: true,
        nullable: false,
    })
    year: number;
}
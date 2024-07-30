import { Test, TestingModule } from "@nestjs/testing";
import { AppointmentsService } from "./appointments.service";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "src/app/entities/user.entity";
import { NotAcceptableException } from "@nestjs/common";
import { Appointment } from "@/app/entities/appointment.entity";

describe("AppointmentsService", () => {
    let service: AppointmentsService;
    let repository: Repository<Appointment>;
    let user: User;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AppointmentsService,
                {
                    provide: getRepositoryToken(Appointment),
                    useValue: {
                        find: jest.fn(),
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AppointmentsService>(AppointmentsService);
        repository = module.get<Repository<Appointment>>(
            getRepositoryToken(Appointment),
        );

        // Mock user
        user = {
            hasAppointmentsOnDate: jest.fn(),
        } as unknown as User;
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should throw error if user has appointment on date", async () => {
            (user.hasAppointmentsOnDate as jest.Mock).mockResolvedValue(true);
            const dto = {
                date: new Date(),
                time: "14:00",
                reason: "Consultation",
                status: "Pending",
            };

            await expect(service.create(dto, user)).rejects.toThrow(
                NotAcceptableException,
            );
        });

        it("should throw error if no available appointment slots", async () => {
            (user.hasAppointmentsOnDate as jest.Mock).mockResolvedValue(false);
            (repository.find as jest.Mock).mockResolvedValue(Array(5).fill({}));

            const dto = {
                date: new Date(),
                time: "14:00",
                reason: "Consultation",
                status: "Pending",
            };

            await expect(service.create(dto, user)).rejects.toThrow(
                NotAcceptableException,
            );
        });

        it("should save appointment if valid", async () => {
            (user.hasAppointmentsOnDate as jest.Mock).mockResolvedValue(false);
            (repository.find as jest.Mock).mockResolvedValue([]);
            (repository.save as jest.Mock).mockResolvedValue({ id: 1 });

            const dto = {
                date: new Date(),
                time: "14:00",
                reason: "Consultation",
                status: "Pending",
            };
            const result = await service.create(dto, user);

            expect(result).toHaveProperty("id");
        });
    });
});

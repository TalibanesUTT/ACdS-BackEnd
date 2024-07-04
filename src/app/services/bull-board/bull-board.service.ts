import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { ExpressAdapter } from "@bull-board/express";
import { Queue } from "bullmq";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";

@Injectable()
export class BullBoardService implements OnModuleInit {
    private readonly serverAdapter: ExpressAdapter;

    constructor(
        @InjectQueue("mail") private readonly mailQueue: Queue,
        @InjectQueue("sms") private readonly smsQueue: Queue
    ) {
        this.serverAdapter = new ExpressAdapter();
        this.serverAdapter.setBasePath("/admin/queues");
    }

    async onModuleInit() {
        createBullBoard({
            queues: [
                new BullMQAdapter(this.mailQueue),
                new BullMQAdapter(this.smsQueue),
            ],
            serverAdapter: this.serverAdapter,
        })
    }

    getBullBoardAdapter() {
        return this.serverAdapter;
    }
}
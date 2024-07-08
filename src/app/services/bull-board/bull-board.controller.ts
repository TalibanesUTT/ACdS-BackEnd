import { Controller, Get, Res, Req, Next } from "@nestjs/common";
import { BullBoardService } from "./bull-board.service";
import { Response, Request } from "express";

@Controller("admin/queues")
export class BullBoardController {
    constructor(private readonly bullBoardService: BullBoardService) {}

    @Get('/')
    redirectToUI(@Res() res: Response) {
        res.redirect('/admin/queues/ui');
    }

    @Get('ui/*')
    async getBullBoardUI(@Req() req: Request, @Res() res: Response, @Next() next) {
        const serverAdapter = this.bullBoardService.getBullBoardAdapter();
        serverAdapter.getRouter()(req, res, next);
    }
}
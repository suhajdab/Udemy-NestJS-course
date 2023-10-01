import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(AuthGuard)
  @Post()
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    // get current user
    const { id: userId } = user;
    // create a report
    return this.reportsService.create(body);
  }
}

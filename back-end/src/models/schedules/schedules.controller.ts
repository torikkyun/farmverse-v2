import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'generated/prisma';
import { Public } from 'src/common/decorators/public.decorator';
import { ScheduleResponseDto } from 'src/common/dto/schedule-response.dto';

@Controller('api/schedules')
@ApiTags('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @ApiBearerAuth()
  create(
    @CurrentUser() user: { id: string; role: UserRole },
    @Body(new ValidationPipe()) createScheduleDto: CreateScheduleDto,
  ): Promise<{ message: string; schedule: ScheduleResponseDto }> {
    return this.schedulesService.create(user, createScheduleDto);
  }

  @Get(':scheduleId')
  @Public()
  findOne(
    @Param('scheduleId') scheduleId: string,
  ): Promise<{ message: string; schedule: ScheduleResponseDto }> {
    return this.schedulesService.findOne(scheduleId);
  }

  @Get()
  @Public()
  findByFarmId(
    @Query('farmId') farmId: string,
  ): Promise<{ message: string; schedule: ScheduleResponseDto }> {
    return this.schedulesService.findByFarmId(farmId);
  }

  @Patch()
  @ApiBearerAuth()
  update(
    @CurrentUser() user: { id: string; role: UserRole },
    @Body(new ValidationPipe()) updateScheduleDto: UpdateScheduleDto,
  ): Promise<{ message: string; schedule: ScheduleResponseDto }> {
    return this.schedulesService.update(user, updateScheduleDto);
  }

  // @Delete(':scheduleId')
  // @ApiBearerAuth()
  // remove(
  //   @Param('scheduleId') scheduleId: string,
  // ): Promise<{ message: string }> {
  //   return this.schedulesService.remove(scheduleId);
  // }
}

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { FoodsService } from '../services/foods.service.js';
import { CreateFoodDto } from '../dto/create.dto.js';
import { UpdateFoodDto } from '../dto/update.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import * as queryOptions from '../services/query-options.js';
import { AuditLogsService } from '../services/audit-logs.service.js';
import type { AuthUser } from '../auth/auth.types.js';

@Controller('foods')
export class FoodsController {
  constructor(
    private readonly foodsService: FoodsService,
    private readonly auditLogsService: AuditLogsService,
  ) { }

  @Get()
  findAll(@Query() query: queryOptions.ListQueryOptions) {
    return queryOptions.hasListQuery(query)
      ? this.foodsService.findPaginated(query)
      : this.foodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.foodsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(
    @Body() createFoodDto: CreateFoodDto,
    @Req() request: Request & { user: AuthUser },
  ) {
    const food = await this.foodsService.create(createFoodDto);
    await this.auditLogsService.record({
      actor: request.user,
      action: 'create',
      entityType: 'food',
      entityId: food?.food_id,
      metadata: { name: food?.food_name, category: food?.food_category },
    });
    return food;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFoodDto: UpdateFoodDto,
    @Req() request: Request & { user: AuthUser },
  ) {
    return this.foodsService.update(id, updateFoodDto).then(async (food) => {
      await this.auditLogsService.record({
        actor: request.user,
        action: 'update',
        entityType: 'food',
        entityId: id,
        metadata: { changedFields: Object.keys(updateFoodDto), name: food?.food_name },
      });
      return food;
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    await this.foodsService.remove(id);
    await this.auditLogsService.record({
      actor: request.user,
      action: 'delete',
      entityType: 'food',
      entityId: id,
    });
  }
}

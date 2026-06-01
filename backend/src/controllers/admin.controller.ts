import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { diskStorage } from 'multer';
import { AdminService } from '../services/admin.service.js';
import { CreateFoodDto } from '../dto/create.dto.js';
import { UpdateFoodDto } from '../dto/update.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { AuditLogsService } from '../services/audit-logs.service.js';
import type { AuthUser } from '../auth/auth.types.js';

const foodUploadsPath = join(process.cwd(), 'uploads', 'foods');

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly auditLogsService: AuditLogsService,
  ) { }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Post('login')
  login(@Body() body: unknown) {
    return this.adminService.login(body);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getOrders() {
    return this.adminService.getOrders();
  }

  @Patch('orders/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateOrder(
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() request: Request & { user: AuthUser },
  ) {
    const order = await this.adminService.updateOrder(id, body);
    await this.auditLogsService.record({
      actor: request.user,
      action: 'update',
      entityType: 'order',
      entityId: id,
      metadata: { body },
    });
    return order;
  }

  @Get('foods')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getFoods() {
    return this.adminService.getFoods();
  }

  @Post('foods')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createFood(
    @Body() body: CreateFoodDto,
    @Req() request: Request & { user: AuthUser },
  ) {
    return this.adminService.createFood(body).then(async (food) => {
      await this.auditLogsService.record({
        actor: request.user,
        action: 'create',
        entityType: 'food',
        entityId: food?.food_id,
        metadata: { name: food?.food_name, category: food?.food_category },
      });
      return food;
    });
  }

  @Patch('foods/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateFood(
    @Param('id') id: string,
    @Body() body: UpdateFoodDto,
    @Req() request: Request & { user: AuthUser },
  ) {
    return this.adminService.updateFood(id, body).then(async (food) => {
      await this.auditLogsService.record({
        actor: request.user,
        action: 'update',
        entityType: 'food',
        entityId: id,
        metadata: { changedFields: Object.keys(body), name: food?.food_name },
      });
      return food;
    });
  }

  @Post('foods/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_req: any, _file: any, callback: (arg0: null, arg1: string) => void) => {
          mkdirSync(foodUploadsPath, { recursive: true });
          callback(null, foodUploadsPath);
        },
        filename: (_req: any, file: { originalname: string; }, callback: (arg0: null, arg1: string) => void) => {
          const safeName = file.originalname
            .replace(extname(file.originalname), '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 60);
          const extension = extname(file.originalname).toLowerCase() || '.jpg';
          callback(null, `${Date.now()}-${safeName || 'food'}${extension}`);
        },
      }),
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          callback(new BadRequestException('Only image uploads are allowed'), false);
          return;
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadFoodImage(@UploadedFile() file: any, @Req() request: Request) {
    if (!file) {
      throw new BadRequestException('image file is required');
    }

    const imagePath = `/uploads/foods/${file.filename}`;
    const imageUrl = `${request.protocol}://${request.get('host')}${imagePath}`;

    return {
      imagePath,
      imageUrl,
    };
  }

  @Post('shippers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createShipper(
    @Body() body: { email: string; name: string; password: string },
    @Req() request: Request & { user: AuthUser },
  ) {
    return this.adminService.createShipper(body).then(async (result) => {
      await this.auditLogsService.record({
        actor: request.user,
        action: 'create',
        entityType: 'user',
        entityId: result.shipper?.id,
        metadata: { email: result.shipper?.email, role: 'shipper' },
      });
      return result;
    });
  }

  @Get('shippers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getShippers() {
    return this.adminService.getShippers();
  }

  @Delete('shippers/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteShipper(
    @Param('id') id: string,
    @Req() request: Request & { user: AuthUser },
  ) {
    return this.adminService.deleteShipper(id).then(async (shipper) => {
      await this.auditLogsService.record({
        actor: request.user,
        action: 'delete',
        entityType: 'user',
        entityId: id,
        metadata: { role: 'shipper' },
      });
      return shipper;
    });
  }
}

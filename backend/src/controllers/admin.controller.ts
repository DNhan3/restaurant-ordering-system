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

const foodUploadsPath = join(process.cwd(), 'uploads', 'foods');

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

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
  updateOrder(@Param('id') id: string, @Body() body: unknown) {
    return this.adminService.updateOrder(id, body);
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
  createFood(@Body() body: CreateFoodDto) {
    return this.adminService.createFood(body);
  }

  @Patch('foods/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateFood(@Param('id') id: string, @Body() body: UpdateFoodDto) {
    return this.adminService.updateFood(id, body);
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
  createShipper(@Body() body: { email: string; name: string; password: string }) {
    return this.adminService.createShipper(body);
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
  deleteShipper(@Param('id') id: string) {
    return this.adminService.deleteShipper(id);
  }
}

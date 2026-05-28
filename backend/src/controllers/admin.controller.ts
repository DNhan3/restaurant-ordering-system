import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
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

const foodUploadsPath = join(process.cwd(), 'uploads', 'foods');

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get()
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Post('login')
  login(@Body() body: unknown) {
    return this.adminService.login(body);
  }

  @Get('orders')
  getOrders() {
    return this.adminService.getOrders();
  }

  @Patch('orders/:id')
  updateOrder(@Param('id') id: string, @Body() body: unknown) {
    return this.adminService.updateOrder(id, body);
  }

  @Get('foods')
  getFoods() {
    return this.adminService.getFoods();
  }

  @Post('foods')
  createFood(@Body() body: CreateFoodDto) {
    return this.adminService.createFood(body);
  }

  @Patch('foods/:id')
  updateFood(@Param('id') id: string, @Body() body: UpdateFoodDto) {
    return this.adminService.updateFood(id, body);
  }

  @Post('foods/upload')
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
}

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    Param,
    Post,
    Put,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import MongooseClassSerializerInterceptor from 'src/interceptors/mongooseClassSerializer.interceptor';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductSerializer } from '../../serializers/product.serializer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
    ) { }

    @UseInterceptors(MongooseClassSerializerInterceptor(ProductSerializer))
    @Get('detail/:id')
    async productDetail(@Param() params) {
        return await this.productService.findById(params.id);
    }

    @UseInterceptors(MongooseClassSerializerInterceptor(ProductSerializer))
    @Get('list')
    async findAll(@Query() params) {
        return await this.productService.findAll(params);
    }

    @UseInterceptors(MongooseClassSerializerInterceptor(ProductSerializer))
    @UseInterceptors(FileInterceptor('product_picture'))
    @Post('create')
    
    async addProduct(
        @Body() productDto: CreateProductDto,
        @UploadedFile() productPicture: any,
    ) {
        if (productPicture) {
            productDto.product_picture = productPicture.filename;
        }
        return await this.productService.create(productDto);
    }

    @UseInterceptors(MongooseClassSerializerInterceptor(ProductSerializer))
    @UseInterceptors(FileInterceptor('product_picture'))
    @Put('update/:id')
    async updateProduct(
        @Param() params,
        @Body() productDto: UpdateProductDto,
        @UploadedFile() productPicture: any,
    ) {
        if (productPicture) {
            productDto.product_picture = productPicture.filename;
        }
        return await this.productService.update(params.id, productDto);
    }

    @Delete('delete/:id')
    async deleteProduct(@Param() params) {
        try {
            await this.productService.delete(params.id);
            return { statusCode: 200, message: 'Prodcut deleted successfully' };
        } catch (e) {
            throw new HttpException('PRODUCT_NOT_FOUND', 404);
        }
    }
}


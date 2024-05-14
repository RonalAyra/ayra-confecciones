import { ProductService } from './product.service';
import {
    Controller,
    Get,
    Param,
    Query,
    UseInterceptors
} from '@nestjs/common';
import MongooseClassSerializerInterceptor from 'src/interceptors/mongooseClassSerializer.interceptor';
import { ProductSerializer } from '../../serializers/product.serializer';

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
    @Get('/')
    async findAll(@Query() params) {
        return await this.productService.findAll(params);
    }
}


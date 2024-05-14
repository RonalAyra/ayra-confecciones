import { HomeService } from './home.service';
import {
    Controller,
    Get,
    Param,
    Query,
    UseInterceptors
} from '@nestjs/common';
import MongooseClassSerializerInterceptor from 'src/interceptors/mongooseClassSerializer.interceptor';
import { ProductSerializer } from '../../serializers/product.serializer';

@Controller('home')
export class HomeController {
    constructor(
        private readonly homeService: HomeService,
    ) { }

    @UseInterceptors(MongooseClassSerializerInterceptor(ProductSerializer))
    @Get('/')
    async findAll(@Query() params) {
        return await this.homeService.findAll(params);
    }
}


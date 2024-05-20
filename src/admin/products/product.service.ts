import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './../../schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { getAggregateResults } from '../../utils/pagination-agregate';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel('Products') private readonly productModel: Model<Product>,
      ) {}
    
      async create(createProductDto: CreateProductDto): Promise<Product> {
        const productExists = await this.productModel.findOne({
          name: createProductDto.name
        });
    
        if (productExists)
          throw new HttpException(
            {
              status: HttpStatus.FORBIDDEN,
              error: 'Product already exists with this name',
            },
            HttpStatus.FORBIDDEN,
          );
    
        const product = new this.productModel(createProductDto);
        await product.save();
        return product;
      }
    
      async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        updateProductDto.status = updateProductDto.status || 'active';
        const productExist = await this.productModel.findOne({
          _id: { $ne: id },
          name: updateProductDto.name,
        });
    
        if (productExist)
          throw new HttpException(
            {
              status: HttpStatus.FORBIDDEN,
              error: 'Product already exists with this name',
            },
            HttpStatus.FORBIDDEN,
          );
    
        const form = { ...updateProductDto };
        console.log(updateProductDto);
        
    
        await this.productModel.findOneAndUpdate({ _id: id }, form);
        const product = await this.productModel.findOne({ _id: id });
    
        if (!product)
          throw new HttpException(
            {
              status: HttpStatus.FORBIDDEN,
              error: `Product doesn't exists.`,
            },
            HttpStatus.FORBIDDEN,
          );
    
        return product;
      }
    
      async delete(id: string): Promise<any> {
        const findProduct = await this.productModel.findOne({ _id: id }).exec();
        if (!findProduct) throw new HttpException('PRODUCT_NOT_FOUND', 404);
        return await this.productModel.deleteOne({ _id: id });
      }
    
      async findAll(params): Promise<any> {
        let search =
          params.status && params.status.length && params.status !== 'all'
            ? { status: params.status }
            : {};
    
        const sort =
          params.sortBy && params.sortBy.length
            ? { sortBy: params.sortBy, sortOrder: 'asc' }
            : {};
    
        const result = await getAggregateResults(
          this.productModel,
          [],
          params,
          sort,
          search,
        );
    
        return result;
      }

    
      async findById(id: string): Promise<Product> {
        const user = await this.productModel.findOne({ _id: id });
    
        if (!user)
          throw new HttpException(
            {
              status: HttpStatus.FORBIDDEN,
              error: `Producto doesn't exists.`,
            },
            HttpStatus.FORBIDDEN,
          );
    
        return user;
      }
}

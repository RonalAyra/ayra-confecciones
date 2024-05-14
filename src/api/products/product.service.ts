import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './../../schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Products') private readonly productModel: Model<Product>,
  ) { }

  async findAll(params): Promise<any> {
    let sort = {};
    if (params.sortBy && params.sortBy.length) {
      sort[params.sortBy] = 1;
    }
    const result = await this.productModel.find({status:'active'}).sort(sort);
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

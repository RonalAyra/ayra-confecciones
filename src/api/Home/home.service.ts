import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../../schemas/product.schema';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel('Products') private readonly productModel: Model<Product>,
  ) { }

  async findAll(params): Promise<any> {
    let sort = {};
    sort['createdAt'] = -1;
    const result = await this.productModel.find({status:'active'}).sort(sort).limit(4);;
    return result;
  }
}

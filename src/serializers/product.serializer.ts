import { Exclude, Expose, Transform, Type } from 'class-transformer';

export class ProductSerializer {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  _id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  its_sale: string;

  @Expose()
  status: string;

  @Expose()
  price: string;
}

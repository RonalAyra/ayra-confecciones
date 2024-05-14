import { Exclude, Expose, Transform, Type } from 'class-transformer';

export class UserSerializer {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => obj._id.toString())
  _id: string;

  @Expose()
  access_token: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  profile_picture: string;

  @Expose()
  user_role: string;

  @Expose()
  status: string;

  @Expose({ name: 'full_name' })
  get full_name(): string {
    const last_name =
      typeof this.last_name == 'string' && this.last_name != 'undefined'
        ? this.last_name
        : '';
    return `${this.first_name} ${last_name}`;
  }

}

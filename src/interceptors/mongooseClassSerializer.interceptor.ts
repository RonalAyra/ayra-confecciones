import {
  ClassSerializerInterceptor,
  PlainLiteralObject,
  Type,
} from '@nestjs/common';
import {
  ClassTransformOptions,
  plainToClass,
  plainToInstance,
} from 'class-transformer';
import { Document } from 'mongoose';

function MongooseClassSerializerInterceptor(
  classToIntercept: Type,
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    pages = -1;
    total = -1;

    private changePlainObjectToClass(document: PlainLiteralObject) {
      return plainToInstance(
        classToIntercept,
        !(document instanceof Document) ? document : document.toJSON(),
      );
    }

    private prepareResponse(
      response: PlainLiteralObject | PlainLiteralObject[],
    ) {
      let toCompare = response;
      if (response && response.hasOwnProperty('rows')) {
        toCompare = response['rows'];
        this.pages = response['pages'];
        this.total = response['total'];
      }

      const result = { rows: [], pages: this.pages, total: this.total };
      if (Array.isArray(toCompare)) {
        if (this.pages == -1 && this.total == -1) {
          return response.map(this.changePlainObjectToClass);
        } else {
          result.rows = response['rows'].map(this.changePlainObjectToClass);
          return result;
        }
      }

      if (this.pages == -1 && this.total == -1) {
        return this.changePlainObjectToClass(response);
      } else {
        result.rows = this.changePlainObjectToClass(response);
        return result;
      }
    }

    serialize(
      response: PlainLiteralObject | PlainLiteralObject[],
      options: ClassTransformOptions,
    ) {
      return super.serialize(this.prepareResponse(response), options);
    }
  };
}

export default MongooseClassSerializerInterceptor;

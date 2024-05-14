import { Controller, Post,  UseInterceptors, UseGuards, Body, Headers} from '@nestjs/common';
import { AuthService } from './auth.service';
// import MongooseClassSerializerInterceptor from '../../interceptors/mongooseClassSerializer.interceptor';
import { UserSerializer } from '../../serializers/user.serializer';
import { LoginAuthDto } from './dto/login-auth.dto';
import MongooseClassSerializerInterceptor from 'src/interceptors/mongooseClassSerializer.interceptor';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @UseInterceptors(MongooseClassSerializerInterceptor(UserSerializer))
    @Post('login')
    loginUser(@Body() userLoginObject: LoginAuthDto) {
        return this.authService.login(userLoginObject);
    }

    @UseInterceptors(MongooseClassSerializerInterceptor(UserSerializer))
    @UseGuards(JwtAuthGuard)
    @Post('user')
    getUser(@Headers() headers) {
        return this.authService.getUser(headers);
    }
}

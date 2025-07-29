import { Controller, Body, Get, Post, Request, Response, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/user/user.dto';
import { AuthService } from './auth.service';
import { LoginGuard, LocalAuthGuard, AuthenticatedGuard, GoogleAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() userDto: CreateUserDto){
        return await this.authService.register(userDto);
    }

    @UseGuards(LoginGuard)
    @Post('login')
    async login2(@Request() req, @Response() res ){
        if(!req.cookies['login'] && req.user){
            res.cookie('login', JSON.stringify(req.user), {
                httpOnly: true,
                maxAge: 1000 * 10
            });
        }
        return res.send({ message : 'login success'})
    }
    
    @UseGuards(LoginGuard)
    @Get('test-guard')
    testGuard(){
        return '로그인된 사용자입니다.';
    }

    @UseGuards(LocalAuthGuard)
    @Post('login-local')
    loginLocal(@Request() req){
        return req.user;
    }

    @UseGuards(AuthenticatedGuard)
    @Get('test-guard-local')
    testGuardWithSession(@Request() req){
        return req.user;
    }

    @Get('to-google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Request() req){}

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Request() req, @Response() res){
        const { user } = req;
        return res.send(user);
    }

}

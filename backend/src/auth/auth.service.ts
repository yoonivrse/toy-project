import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}

    async register(userDto: CreateUserDto) {
        const user = await this.userService.getUser(userDto.email);
        if(user) {
            throw new HttpException(
                '해당 유저가 이미 존재합니다. ',
                HttpStatus.BAD_REQUEST,
            );
        }

        const encryptedPassword = bcrypt.hashSync(userDto.password, 10);

        try {
            const user = await this.userService.createUser({
                ...userDto,
                password: encryptedPassword,
            });

            user.password = undefined;
            return user;
        }
        catch(e){
            throw new HttpException('서버 에러', 500);
        }
    }

    async validateUser(email: string, password: string) {
        const user = await this.userService.getUser(email);

        if(!user)
            return null;
        const {password: hashedPassword, ...userInfo} = user;

        if(bcrypt.compareSync(password, hashedPassword)){
            return userInfo;
        }

        return null;
    }
}

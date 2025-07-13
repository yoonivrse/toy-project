import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Injectable()
export class LoginGuard implements CanActivate {
    constructor(private authService: AuthService){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        if(request.cookies['login'])
            return true;

        if(!request.body.email || !request.body.password)
            return false;

        const user = await this.authService.validateUser(
            request.body.email,
            request.body.password,
        );

        if(!user)
            return false;

        request.user = user;
        return true;
    }
}
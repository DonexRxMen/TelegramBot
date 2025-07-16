import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const adminToken = this.configService.get("ADMIN_API_TOKEN");

    const cookieToken = request.cookies?.["admin-token"];

    if (!cookieToken) {
      throw new UnauthorizedException("Admin token required in cookies");
    }

    if (cookieToken !== adminToken) {
      throw new UnauthorizedException("Invalid admin token");
    }

    return true;
  }
}

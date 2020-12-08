import { Controller, Get, UseGuards, HttpStatus, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// https://dev.to/elishaking/how-to-implement-facebook-login-with-nestjs-90h
// http://www.passportjs.org/docs/google/
@Controller('auth')
export class AuthController {

  @Get("/facebook")
  @UseGuards(AuthGuard("facebook"))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get("/facebook/redirect")
  @UseGuards(AuthGuard("facebook"))
  async facebookLoginRedirect(@Req() req: any): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }

  @Get("/google")
  @UseGuards(AuthGuard("google"))
  async googleLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get("/google/redirect")
  @UseGuards(AuthGuard("google"))
  async googleLoginRedirect(@Req() req: any): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }
}
import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('usuarios/:userName/genero/:gender')
  getHelloModiffy(
    @Param('userName') userName: string,
    @Param('gender') gender: string,
  ) {
    return `Hola ${userName}, puedes llegar lejos por que eres un@ gran ${gender}, si estudias con entusiasmo y dedicación!`;
  }
  @Get('users')
  queryUsers(@Query('region') region: string, @Query('idiom') idiom: string) {
    return `usuarios de la region de ${region}, hablan el idioma ${idiom}`;
  }
}

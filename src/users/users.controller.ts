import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { createUserDto, updateUserDto, userDto } from './dtos';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { User } from './user.entity';

/*
  NOTE: This controller is responsible for handling requests to the /auth route
  controllers only deal with route and request handling
  specifically data in requests and data in responses
 */
@Controller('users') // /auth route
@Serialize(userDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    console.log('whoami', { user });
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: createUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: createUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null;
    console.log('signout', { session });
  }

  @Get()
  @UseGuards(AuthGuard)
  async findUserByEmail(@Query('email') email: string) {
    const users = await this.usersService.findByEmail(email);
    if (!users.length) {
      throw new NotFoundException(`No user with email ${email} found`);
    }
    return users;
  }

  @Get('/')
  // @UseGuards(AuthGuard)
  findAllUsers() {
    return this.usersService.findAll();
  }

  @Get('/:id')
  // @UseGuards(AuthGuard)
  async findUser(@Param('id') id: number) {
    const user = await this.usersService.findOne(id);
    console.log('found user', user);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateUser(@Param('id') id: number, @Body() body: updateUserDto) {
    return this.usersService.update(id, body);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  deleteUser(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}

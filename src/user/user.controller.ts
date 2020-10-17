import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  NotFoundException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScopeGuard } from '../guard/scope.guard';
import { Scope } from '../auth/scope.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './schema/user.schema';
import { UserService } from './user.service';

@ApiBearerAuth('JWT')
@UseGuards(ScopeGuard)
@UsePipes(new ValidationPipe())
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {
    userService.createAdminIfNotExists();
  }

  @ApiResponse({
    type: [CreateUserDto],
    status: 200,
  })
  @Scope('admin')
  @Get()
  list(): Promise<User[]> {
    return this.userService.findAll();
  }

  @ApiResponse({
    type: CreateUserDto,
    status: 200,
  })
  @ApiResponse({ status: 404 })
  @Scope('admin')
  @Get(':id')
  async user(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @ApiResponse({
    type: CreateUserDto,
    status: 200,
  })
  @Scope('admin')
  @Post()
  async createUser(@Body() data: CreateUserDto): Promise<CreateUserDto> {
    return await this.userService.createUser(data);
  }

  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  @Scope('admin')
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    const isDeleted = await this.userService.delete(id);
    if (!isDeleted) {
      throw new NotFoundException();
    }

    return isDeleted;
  }
}

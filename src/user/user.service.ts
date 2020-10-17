import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private authService: AuthService,
  ) {}

  async createUser(data: CreateUserDto): Promise<CreateUserDto> {
    const model = await this.userModel.create(data);
    const { username, _id, scope } = model;
    const token = this.authService.createToken(username, _id);
    await model.update({ token });
    return {
      token,
      username,
      id: _id,
      scope,
    };
  }

  async findUserByIdAndUsername(
    id: string,
    username: string,
  ): Promise<User | undefined> {
    const user = await this.userModel.findById(id);

    if (user && user.username === username) {
      return user;
    }

    return undefined;
  }

  findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  findAll(where: any = {}): Promise<User[]> {
    return this.userModel.find(where).exec();
  }

  async delete(id: string): Promise<boolean> {
    if (!isValidObjectId(id)) {
      return false;
    }
    const user = await this.userModel.findByIdAndDelete(id).exec();
    return !!user;
  }

  async createAdminIfNotExists() {
    const count = await this.userModel.countDocuments().exec();
    if (!count) {
      const user = await this.createUser({
        username: 'admin',
        scope: ['admin'],
      });
      console.log('Admin user ctreated', user);
    }
  }
}

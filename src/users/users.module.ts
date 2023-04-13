import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [AuthenticationModule],
})
export class UsersModule {}

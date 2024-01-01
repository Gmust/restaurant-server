import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { hash } from 'bcrypt';

import { User, UserSchema } from '../schemas/user.schema';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', async function (next) {
            if (!this.isModified('password')) {
              return next();
            }
            try {
              const hashedPassword = await hash(this.password, 12);
              this.password = hashedPassword;
              return next();
            } catch (error) {
              return next(error);
            }
          });
          schema.pre('find', function () {
            this.populate('orders', '_id orderDate status dishes totalPrice promoCode');
            this.populate('cart', 'id dishes totalPrice');
          });

          return schema;
        },
      },
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

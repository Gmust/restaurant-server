import * as mongoose from 'mongoose';
import { ICart } from '../types/cart';
import { IDish } from '../types/dish';

export const CartSchema = new mongoose.Schema<ICart>({
  dishes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }],
    required: [true, 'Dishes is required'],
  },
  totalPrice: {
    type: Number,
    default: async function (this: ICart) {
      const dishPrices = await mongoose
        .model<IDish>('Dish')
        .find({ _id: { $in: this.dishes } })
        .distinct('price');

      return dishPrices.reduce((sum, price) => sum + price, 0);
    },
  },
});

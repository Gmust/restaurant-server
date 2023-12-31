import * as mongoose from 'mongoose';
import * as process from 'process';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> => mongoose.connect(process.env.DB_URL),
  },
];

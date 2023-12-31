export interface IIngredient extends Document {
  name: string;
  quantity: number;
  unit: Units;
}

export enum Units {
  Gram = 'g',
  Kilogram = 'kg',
  Milligram = 'mg',
}

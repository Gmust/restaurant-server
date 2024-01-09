export enum DishCategories {
  Soup = 'Soup',
  Salad = 'Salad',
  MainCourse = 'Main Course',
  Dessert = 'Dessert',
  Appetizer = 'Appetizer',
  Breakfast = 'Breakfast',
  SideDish = 'Side Dish',
  Beverage = 'Beverage',
  Snack = 'Snack',
}

export interface GetDishesInterface {
  skip: number;
  limit: number;
  isVegan?: boolean;
  category: DishCategories;
}

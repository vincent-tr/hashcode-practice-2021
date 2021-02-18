export type Pizza = {
  id: number;
  ingredients: string[];
};

export function parsePizza(line: string, pizzaId: number): Pizza {
  return {
    id: pizzaId,
    ingredients: line.split(" ").slice(1),
  };
}

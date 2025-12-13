export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

export const products: Product[] = [
  {
    id: "ube-ensaymada",
    name: "Ube Ensaymada",
    description: "Soft, sweet bread with ube (purple yam) and cheese.",
    price: 3.50,
    imageUrl: "https://picsum.photos/id/237/300/200", // Placeholder image
  },
  {
    id: "leche-flan",
    name: "Leche Flan",
    description: "Creamy caramel custard, a classic Filipino dessert.",
    price: 6.00,
    imageUrl: "https://picsum.photos/id/238/300/200", // Placeholder image
  },
  {
    id: "puto",
    name: "Puto",
    description: "Steamed rice cakes, often topped with cheese.",
    price: 5.00,
    imageUrl: "https://picsum.photos/id/239/300/200", // Placeholder image
  },
  {
    id: "kutsinta",
    name: "Kutsinta",
    description: "Chewy, sticky steamed rice cakes, usually with grated coconut.",
    price: 6.00,
    imageUrl: "https://picsum.photos/id/240/300/200", // Placeholder image
  },
  {
    id: "sapin-sapin",
    name: "Sapin-Sapin",
    description: "Layered sticky rice cake with various flavors and colors.",
    price: 6.00,
    imageUrl: "https://picsum.photos/id/241/300/200", // Placeholder image
  },
  {
    id: "palitaw",
    name: "Palitaw",
    description: "Flat, chewy rice cakes coated with grated coconut, sesame seeds, and sugar.",
    price: 6.00,
    imageUrl: "https://picsum.photos/id/242/300/200", // Placeholder image
  },
];

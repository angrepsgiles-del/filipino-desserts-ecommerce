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
    price: 2.50,
    imageUrl: "/images/ube-ensaymada.jpg",
  },
  {
    id: "leche-flan",
    name: "Leche Flan",
    description: "Creamy caramel custard, a classic Filipino dessert.",
    price: 3.00,
    imageUrl: "/images/leche-flan.jpg",
  },
  {
    id: "puto",
    name: "Puto",
    description: "Steamed rice cakes, often topped with cheese.",
    price: 1.00,
    imageUrl: "/images/puto.jpg",
  },
  {
    id: "kutsinta",
    name: "Kutsinta",
    description: "Chewy, sticky steamed rice cakes, usually with grated coconut.",
    price: 1.25,
    imageUrl: "/images/kutsinta.jpg",
  },
  {
    id: "sapin-sapin",
    name: "Sapin-Sapin",
    description: "Layered sticky rice cake with various flavors and colors.",
    price: 3.50,
    imageUrl: "/images/sapin-sapin.jpg",
  },
  {
    id: "palitaw",
    name: "Palitaw",
    description: "Flat, chewy rice cakes coated with grated coconut, sesame seeds, and sugar.",
    price: 1.75,
    imageUrl: "/images/palitaw.jpg",
  },
];

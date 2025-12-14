export type Product = {
  id: string;
  name: string;
  description: string;
  shortDescription: string; // Added shortDescription
  price: number;
  imageUrl: string;
};

export const products: Product[] = [
  {
    id: "ube-ensaymada",
    name: "Ube Ensaymada",
    description: "pillowy filipino sweet bread swirled with ube and finished with a light, salty-sweet topping. soft enough to squish, rich without being heavy. this is the one you say you’ll “save for later” and then absolutely don’t.",
    shortDescription: "soft. buttery. ube-loaded. gone fast.", // New shortDescription
    price: 3.50,
    imageUrl: "/images/Ensay.png", // Placeholder image
  },
  {
    id: "leche-flan",
    name: "Leche Flan",
    description: "dense, creamy caramel custard made the traditional filipino way. smooth all the way through, with a deep caramel top that actually tastes like caramel. rich, but worth it.",
    shortDescription: "silky. rich. zero shortcuts.", // New shortDescription
    price: 6.00,
    imageUrl: "/images/Flan.png", // Placeholder image
  },
  {
    id: "puto",
    name: "Puto",
    description: "steamed filipino rice cakes that are soft, airy, and just sweet enough. simple on purpose. perfect solo or as a side. proof that not everything needs to be loud to be elite.",
    shortDescription: "light, fluffy, minding its business.", // New shortDescription
    price: 5.00,
    imageUrl: "/images/Puto.png", // Placeholder image
  },
  {
    id: "kutsinta",
    name: "Kutsinta",
    description: "soft, chewy filipino rice cakes with that signature bounce. lightly sweet and best topped with coconut. not flashy, but if you know, you know.",
    shortDescription: "chewy. glossy. underrated.", // New shortDescription
    price: 6.00,
    imageUrl: "/images/Kutsi.png", // Placeholder image
  },
  {
    id: "sapin-sapin",
    name: "Sapin-Sapin",
    description: "classic filipino rice cake with soft, sticky layers made from coconut milk and glutinous rice. every layer hits different. sweet, chewy, and low-key addictive. looks cute, eats serious.",
    shortDescription: "layered. chewy. colourful. no notes.", // New shortDescription
    price: 6.00,
    imageUrl: "/images/Sapin.png", // Placeholder image
  },
  {
    id: "palitaw",
    name: "Palitaw",
    description: "rice dough cooked until it floats, then rolled in coconut and sugar. minimal ingredients, maximum comfort. light, chewy, and weirdly hard to stop eating.",
    shortDescription: "soft. chewy. coconut-coated.", // New shortDescription
    price: 6.00,
    imageUrl: "/images/Paliw.png", // Placeholder image
  },
  {
    id: "cassava-cake", // New product
    name: "Cassava Cake",
    description: "made with grated cassava and coconut milk, baked until soft with a slight chew. sweet but balanced. feels like home, even if you’re far from it.",
    shortDescription: "coconut-rich comfort energy.", // New shortDescription
    price: 5.00,
    imageUrl: "/images/Cassa.png"
  },
];

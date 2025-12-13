const AboutPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-yellow-200 via-purple-300 to-green-200 dark:from-yellow-700 dark:via-purple-800 dark:to-green-700 font-sans p-4">
      <main className="w-full max-w-4xl py-8">
        <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
        <div className="bg-white/30 dark:bg-zinc-800/30 rounded-lg shadow-lg backdrop-blur-md border border-white/20 dark:border-zinc-700/50 p-6">
          <p>
            Welcome to GawaKamay, your home for delicious, home-baked Filipino desserts. 
            Our mission is to share the rich and diverse flavors of the Philippines with the world.
          </p>
          <p className="mt-4">
            Each of our desserts is made with love and care, using traditional recipes and the finest ingredients. 
            We believe in the power of food to bring people together and create lasting memories.
          </p>
          <p className="mt-4">
            From the soft and chewy Puto to the rich and creamy Leche Flan, our menu is a celebration of Filipino culture and culinary heritage. 
            We invite you to explore our selection and taste the difference that home-baking makes.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;

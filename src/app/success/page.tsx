export default function SuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-yellow-200 via-purple-300 to-green-200 dark:from-yellow-700 dark:via-purple-800 dark:to-green-700 font-sans p-4 text-black dark:text-white">
      <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-lg">Thank you for your purchase. Your order has been placed.</p>
    </div>
  );
}

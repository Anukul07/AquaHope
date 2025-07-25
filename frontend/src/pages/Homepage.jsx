export default function Homepage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 text-gray-900 font-inter">
      <h1 className="text-4xl font-bold mb-4">Welcome to AquaHope 💧</h1>
      <p className="text-lg">Let’s bring clean water to Africa together!</p>
      <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Get Started
      </button>
    </div>
  );
}

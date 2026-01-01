import { PenSquare, BookOpen } from "lucide-react";

const WelcomeBanner = () => {
  return (
    <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome to Author Dashboard ✍️
          </h1>
          <p className="text-sm md:text-base text-indigo-100 mt-2">
            Create, edit, and manage your blogs all in one place.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <PenSquare className="h-6 w-6" />
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;

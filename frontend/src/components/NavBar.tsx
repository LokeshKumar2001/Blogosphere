import { NavLink, useNavigate } from "react-router-dom";
import logo from "/blog.jpeg"; // your icon image
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const navClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-blue-600";

  const handleLogout = async () => {
    logout();
    navigate("/logout");
  };
  return (
    <nav className="w-full bg-white shadow-md px-8 py-4 flex items-center justify-between fixed top-0 left-0 right-0 h-16 z-50 border-b">
      <div className="flex items-center gap-2">
        <img src={logo} alt="BlogSphere" className="h-8 w-8 rounded-full" />
        <span className="text-xl font-bold text-gray-800">BlogSphere</span>
      </div>

      <div className="flex gap-8 text-lg">
        <NavLink to="/" className={navClass}>
          Home
        </NavLink>
        <NavLink to="/about" className={navClass}>
          About
        </NavLink>
        <NavLink to="/contact" className={navClass}>
          Contact
        </NavLink>
        <NavLink to="/source" className={navClass}>
          Source
        </NavLink>
      </div>

      <div className="cursor-pointer">
        {/*<UserCircle className="h-8 w-8 text-gray-700 hover:text-blue-600" />*/}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage
                className="h-8 w-8 text-gray-700 rounded-2xl"
                src="https://github.com/shadcn.png"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/author/profile")}>
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;

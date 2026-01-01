import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  return (
    <div>
      Logout successful
      <Button onClick={() => navigate("/login")}>Back to Login Page</Button>
    </div>
  );
};

export default Logout;

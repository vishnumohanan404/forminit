import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthProvider";

const DashboardPage = () => {
  const { setUser } = useAuth();
  const handleLogout = () => {
    setUser(null);
  };
  return (
    <div>
      <Button onClick={handleLogout}> LogOut</Button>
    </div>
  );
};

export default DashboardPage;

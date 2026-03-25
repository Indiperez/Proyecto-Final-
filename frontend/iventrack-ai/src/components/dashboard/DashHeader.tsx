import { Bell, ChevronDown, LogOut, Search, User } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";

export const DashHeader = () => {
  const navigate = useNavigate();

  const user = { name: "", role: "" };
  const alerts = [{ status: "" }];

  const pendingAlerts = alerts.filter((a) => a.status === "pending").length;

  const handleLogout = () => {
    // logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-card/50 backdrop-blur-xl border-b border-border sticky top-0 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos, movimientos..."
              className="pl-10 bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all w-full"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            onClick={() => navigate("/dashboard/alerts")}
          >
            <Bell className="w-5 h-5" />
            {pendingAlerts > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs animate-pulse"
              >
                {pendingAlerts}
              </Badge>
            )}
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 px-3 hover:bg-secondary/50"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-foreground">
                    {user?.name || "Usuario"}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.role || "rol"}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigate("/dashboard/settings")}
              >
                <User className="w-4 h-4 mr-2" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigate("/dashboard/alerts")}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notificaciones
                {pendingAlerts > 0 && (
                  <Badge variant={"secondary"} className="ml-auto">
                    {pendingAlerts}
                  </Badge>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

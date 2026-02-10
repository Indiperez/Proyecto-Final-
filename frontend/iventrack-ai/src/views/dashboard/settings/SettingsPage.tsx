import { useState } from "react";
import {
  User,
  Shield,
  Bell,
  Save,
  Users,
  AlertTriangle,
  Clock,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";

// Mock users data
const mockUsers = [
  {
    id: "1",
    name: "Admin Demo",
    email: "admin@inventrackup.com",
    role: "admin",
    status: "active",
  },
  {
    id: "2",
    name: "Operador Demo",
    email: "operador@inventrackup.com",
    role: "operator",
    status: "active",
  },
  {
    id: "3",
    name: "María García",
    email: "maria@inventrackup.com",
    role: "operator",
    status: "active",
  },
  {
    id: "4",
    name: "Carlos López",
    email: "carlos@inventrackup.com",
    role: "operator",
    status: "inactive",
  },
];

export default function SettingsPage() {
  const user = { name: "", role: "", email: "" };
  const isAdmin = user?.role === "admin";

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [alertSettings, setAlertSettings] = useState({
    lowStockEnabled: true,
    criticalStockEnabled: true,
    noMovementEnabled: true,
    noMovementDays: "30",
  });

  const [stockSettings, setStockSettings] = useState({
    safetyStockPercentage: "20",
    reorderLeadTime: "7",
    analysisPeriod: "30",
  });

  const handleSaveProfile = () => {
    alert("Perfil actualizado correctamente");
  };

  const handleSaveAlerts = () => {
    alert("Configuración de alertas actualizada");
  };

  const handleSaveStock = () => {
    alert("Parámetros de stock actualizados");
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona tu cuenta y preferencias del sistema
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-secondary/50 border border-border/50">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <User className="w-4 h-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger
            value="alerts"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Bell className="w-4 h-4 mr-2" />
            Alertas
          </TabsTrigger>
          {isAdmin && (
            <>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Users className="w-4 h-4 mr-2" />
                Usuarios
              </TabsTrigger>
              <TabsTrigger
                value="stock"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Sliders className="w-4 h-4 mr-2" />
                Parámetros
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Actualiza tu información de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-lg">{user?.name}</p>
                  <Badge
                    className={cn(
                      "mt-1",
                      user?.role === "admin"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-secondary text-secondary-foreground",
                    )}
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {user?.role === "admin" ? "Administrador" : "Operador"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSaveProfile}
                  className="bg-primary text-primary-foreground"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Configuración de Alertas
              </CardTitle>
              <CardDescription>
                Personaliza cuándo recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium">Alerta de Stock Bajo</p>
                    <p className="text-sm text-muted-foreground">
                      Notificar cuando el stock caiga por debajo del mínimo
                    </p>
                  </div>
                </div>
                <Switch
                  checked={alertSettings.lowStockEnabled}
                  onCheckedChange={(checked) =>
                    setAlertSettings({
                      ...alertSettings,
                      lowStockEnabled: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-critical/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-critical" />
                  </div>
                  <div>
                    <p className="font-medium">Alerta de Stock Crítico</p>
                    <p className="text-sm text-muted-foreground">
                      Notificar cuando el stock llegue a cero
                    </p>
                  </div>
                </div>
                <Switch
                  checked={alertSettings.criticalStockEnabled}
                  onCheckedChange={(checked) =>
                    setAlertSettings({
                      ...alertSettings,
                      criticalStockEnabled: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Alerta de Sin Movimiento</p>
                    <p className="text-sm text-muted-foreground">
                      Notificar productos sin actividad
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Select
                    value={alertSettings.noMovementDays}
                    onValueChange={(value) =>
                      setAlertSettings({
                        ...alertSettings,
                        noMovementDays: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-32 bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 días</SelectItem>
                      <SelectItem value="30">30 días</SelectItem>
                      <SelectItem value="60">60 días</SelectItem>
                    </SelectContent>
                  </Select>
                  <Switch
                    checked={alertSettings.noMovementEnabled}
                    onCheckedChange={(checked) =>
                      setAlertSettings({
                        ...alertSettings,
                        noMovementEnabled: checked,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSaveAlerts}
                  className="bg-primary text-primary-foreground"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Configuración
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab (Admin only) */}
        {isAdmin && (
          <TabsContent value="users" className="space-y-6">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Gestión de Usuarios
                </CardTitle>
                <CardDescription>
                  Administra los usuarios del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead className="text-muted-foreground">
                        Usuario
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Email
                      </TableHead>
                      <TableHead className="text-muted-foreground text-center">
                        Rol
                      </TableHead>
                      <TableHead className="text-muted-foreground text-center">
                        Estado
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((u) => (
                      <TableRow key={u.id} className="border-border/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium">{u.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {u.email}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={cn(
                              "border",
                              u.role === "admin"
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-secondary text-secondary-foreground border-border",
                            )}
                          >
                            {u.role === "admin" ? "Admin" : "Operador"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={cn(
                              "border",
                              u.status === "active"
                                ? "bg-success/10 text-success border-success/20"
                                : "bg-muted text-muted-foreground border-border",
                            )}
                          >
                            {u.status === "active" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Stock Parameters Tab (Admin only) */}
        {isAdmin && (
          <TabsContent value="stock" className="space-y-6">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-primary" />
                  Parámetros de Stock
                </CardTitle>
                <CardDescription>
                  Configura los parámetros de gestión de inventario
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Stock de Seguridad (%)</Label>
                    <Select
                      value={stockSettings.safetyStockPercentage}
                      onValueChange={(value) =>
                        setStockSettings({
                          ...stockSettings,
                          safetyStockPercentage: value,
                        })
                      }
                    >
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="15">15%</SelectItem>
                        <SelectItem value="20">20%</SelectItem>
                        <SelectItem value="25">25%</SelectItem>
                        <SelectItem value="30">30%</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Porcentaje adicional sobre el stock mínimo
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Lead Time de Reorden (días)</Label>
                    <Select
                      value={stockSettings.reorderLeadTime}
                      onValueChange={(value) =>
                        setStockSettings({
                          ...stockSettings,
                          reorderLeadTime: value,
                        })
                      }
                    >
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 días</SelectItem>
                        <SelectItem value="5">5 días</SelectItem>
                        <SelectItem value="7">7 días</SelectItem>
                        <SelectItem value="14">14 días</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Tiempo promedio de reposición
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Período de Análisis</Label>
                    <Select
                      value={stockSettings.analysisPeriod}
                      onValueChange={(value) =>
                        setStockSettings({
                          ...stockSettings,
                          analysisPeriod: value,
                        })
                      }
                    >
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 días</SelectItem>
                        <SelectItem value="60">60 días</SelectItem>
                        <SelectItem value="90">90 días</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Período para cálculos de predicción
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSaveStock}
                    className="bg-primary text-primary-foreground"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Parámetros
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

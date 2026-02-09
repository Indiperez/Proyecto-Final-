export type UserRole = "admin" | "operator";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type Product = {
  id: string;
  code: string;
  name: string;
  category: string;
  stockMin: number;
  leadTime: number;
  currentStock: number;
  status: "active" | "inactive";
};

export type Movement = {
  id: string;
  productId: string;
  type: "entry" | "exit" | "adjustment";
  quantity: number;
  date: string;
  observation: string;
};

export type Alert = {
  id: string;
  productId: string;
  type: "low_stock" | "critical_stock" | "no_movement" | "reorder";
  priority: "high" | "medium" | "low";
  date: string;
  status: "pending" | "attended";
  recommendation: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ) => Promise<boolean>;
  logout: () => void;
};

export type InventoryState = {
  products: Product[];
  movements: Movement[];
  alerts: Alert[];
  categories: string[];
  addProduct: (product: Omit<Product, "id" | "currentStock">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addMovement: (movement: Omit<Movement, "id">) => void;
  attendAlert: (id: string) => void;
};

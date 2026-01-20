import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  email: string;
  name: string;
  hasCompletedOnboarding: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, isReturningUser?: boolean) => void;
  logout: () => void;
  completeOnboarding: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("demo_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, isReturningUser: boolean = false) => {
    // Check if this email has logged in before (simulated)
    const existingUsers = JSON.parse(localStorage.getItem("demo_users") || "[]");
    const existingUser = existingUsers.find((u: { email: string }) => u.email === email);
    
    const newUser: User = existingUser || {
      email,
      name: email.split("@")[0],
      hasCompletedOnboarding: isReturningUser,
    };
    
    // Save to users list if new
    if (!existingUser) {
      localStorage.setItem("demo_users", JSON.stringify([...existingUsers, newUser]));
    }
    
    setUser(newUser);
    localStorage.setItem("demo_user", JSON.stringify(newUser));
  };

  const completeOnboarding = () => {
    if (user) {
      const updatedUser = { ...user, hasCompletedOnboarding: true };
      setUser(updatedUser);
      localStorage.setItem("demo_user", JSON.stringify(updatedUser));
      
      // Update in users list too
      const existingUsers = JSON.parse(localStorage.getItem("demo_users") || "[]");
      const updatedUsers = existingUsers.map((u: User) =>
        u.email === user.email ? updatedUser : u
      );
      localStorage.setItem("demo_users", JSON.stringify(updatedUsers));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("demo_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, completeOnboarding, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

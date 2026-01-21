import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password: string;
}

type StrengthLevel = "weak" | "medium" | "strong";

interface StrengthResult {
  level: StrengthLevel;
  score: number;
  label: string;
  color: string;
  bgColor: string;
}

export const getPasswordStrength = (password: string): StrengthResult => {
  if (!password || password.length < 8) {
    return {
      level: "weak",
      score: 1,
      label: "Weak",
      color: "bg-destructive",
      bgColor: "bg-destructive/20",
    };
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const criteriaCount = [hasUppercase, hasLowercase, hasNumber, hasSymbol].filter(Boolean).length;

  if (criteriaCount >= 4 && password.length >= 8) {
    return {
      level: "strong",
      score: 3,
      label: "Strong",
      color: "bg-green-500",
      bgColor: "bg-green-500/20",
    };
  }

  if (criteriaCount >= 2 && password.length >= 8) {
    return {
      level: "medium",
      score: 2,
      label: "Medium",
      color: "bg-yellow-500",
      bgColor: "bg-yellow-500/20",
    };
  }

  return {
    level: "weak",
    score: 1,
    label: "Weak",
    color: "bg-destructive",
    bgColor: "bg-destructive/20",
  };
};

export const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              level <= strength.score ? strength.color : "bg-muted"
            )}
          />
        ))}
      </div>
      <p
        className={cn(
          "text-xs font-medium transition-colors duration-300",
          strength.level === "weak" && "text-destructive",
          strength.level === "medium" && "text-yellow-600",
          strength.level === "strong" && "text-green-600"
        )}
      >
        Password strength: {strength.label}
      </p>
    </div>
  );
};

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingActionButtonProps {
  onClick: () => void;
  label?: string;
}

export function FloatingActionButton({ onClick, label = "Add" }: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full shadow-lg md:hidden animate-scale-in"
      aria-label={label}
    >
      <Plus className="w-6 h-6" />
    </Button>
  );
}

import { ThemeToggle } from "../theme-toggle";
import { ThemeProvider } from "../theme-provider";

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <div className="p-6 flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Toggle theme:</span>
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}

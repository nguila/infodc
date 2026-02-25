import { validatePassword } from "@/lib/passwordValidation";
import { Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Props {
  password: string;
}

export function PasswordStrength({ password }: Props) {
  const checks = validatePassword(password);
  const metCount = checks.filter((c) => c.met).length;
  const percent = (metCount / checks.length) * 100;

  if (!password) return null;

  return (
    <div className="space-y-2">
      <Progress value={percent} className="h-1.5" />
      <div className="grid grid-cols-2 gap-1">
        {checks.map((c) => (
          <div key={c.label} className="flex items-center gap-1.5">
            {c.met ? (
              <Check className="w-3 h-3 text-green-600" />
            ) : (
              <X className="w-3 h-3 text-muted-foreground" />
            )}
            <span className={`text-[11px] ${c.met ? "text-green-600" : "text-muted-foreground"}`}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

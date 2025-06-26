
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface NewKpiCardProps {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  iconContainerClass?: string; // e.g., "bg-blue-100 text-blue-600"
}

export function NewKpiCard({ title, value, Icon, iconContainerClass = "bg-primary/10 text-primary" }: NewKpiCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="flex flex-col items-center text-center p-6 gap-1">
        <div className={`p-2 rounded-md ${iconContainerClass} mb-2`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardContent>
    </Card>
  );
}

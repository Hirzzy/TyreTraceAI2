
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NewKpiCardProps {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  iconContainerClass?: string; // e.g., "bg-blue-100 text-blue-600"
}

export function NewKpiCard({ title, value, Icon, iconContainerClass = "bg-primary/10 text-primary" }: NewKpiCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
         <div className={`p-2 rounded-md ${iconContainerClass}`}>
            <Icon className="h-5 w-5" />
         </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  );
}

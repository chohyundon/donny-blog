"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = ["트렌딩", "최신", "React", "TypeScript", "Next.js", "CSS"];

export default function TabBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "트렌딩";

  const handleTab = (tab: string) => {
    const params = new URLSearchParams();
    params.set("tab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative border-b border-border">
      <div className="mx-auto max-w-7xl px-8">
        <Tabs
          value={activeTab}
          onValueChange={(value) => handleTab(value as string)}>
          <TabsList
            variant="line"
            className="scrollbar-hide h-auto! w-full justify-start gap-1 overflow-x-auto bg-transparent p-0 pb-2">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="shrink-0 rounded-none border-none px-4 py-4 text-sm font-medium text-foreground/70 data-active:text-foreground data-active:after:bg-primary! data-active:after:opacity-100">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

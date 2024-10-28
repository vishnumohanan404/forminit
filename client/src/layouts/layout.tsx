interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen min-w-[100%] bg-background text-foreground">
      <div className="overflow-y-auto h-full">{children}</div>
    </div>
  );
}

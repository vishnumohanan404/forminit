interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen min-w-[100%] bg-background text-foreground">
      <div className="overflow-y-auto h-full">{children}</div>

      {/* <footer className="border-t py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2024 Your Company. All rights reserved.
          </p>
        </div>
      </footer> */}
    </div>
  );
}

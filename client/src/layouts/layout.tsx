interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="block min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
};

export default Layout;

export default function Footer() {
  return (
    <footer className="border-t border-border/50 py-6 md:px-8 md:py-8">
      <div className="container mx-auto flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Konecbo. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

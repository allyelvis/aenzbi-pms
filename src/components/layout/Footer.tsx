export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Aenzbi PMS. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          Elegantly managing your stays.
        </p>
      </div>
    </footer>
  );
}

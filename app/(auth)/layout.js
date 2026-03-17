import "../globals.css";

export const metadata = {
  title: {
    default: "Account | Topevekreation",
    template: "%s | Topevekreation",
  },
  description: "Sign in or create your Topevekreation account to shop luxury fashion, track orders, and manage your profile.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export const metadata = {
  title: "QR Pickup Order",
  description: "Scan QR and order pickup"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import './globals.scss'
import { Providers } from './providers';

export const metadata = {
  title: 'For All WASM Contract Lovers Astar Network',
  description: 'For All WASM Contract Lovers Astar Network',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
<html lang="en">
  <body>
    <Providers>
      {children}
    </Providers>
  </body>
</html>
  )
}

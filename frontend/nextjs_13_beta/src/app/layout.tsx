import './globals.scss'
import { Providers } from './components/providers';
import DappEnv from './components/dappenv';

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
      <DappEnv />
      {children}
    </Providers>
    <footer className="disclaimer">
      <p>
        This dApp is not Astar Network official. It was created by an individual.<br />
        Contracts have not been audited. Please DYOR when using.
      </p>
    </footer>
  </body>
</html>
  )
}

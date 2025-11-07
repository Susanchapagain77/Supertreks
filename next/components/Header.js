import Link from 'next/link'

export default function Header(){
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="logo"><Link href="/">Super Treks</Link></div>
        <nav>
          <Link href="/">Home</Link> | <Link href="/packages">Packages</Link> | <Link href="/">About</Link>
        </nav>
      </div>
    </header>
  )
}

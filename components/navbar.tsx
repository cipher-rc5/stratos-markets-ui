"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { WalletButton } from "./wallet-button"

const StratosLogo = () => (
  <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
    <Image src="/stratos-rook.svg" alt="Stratos" width={36} height={36} className="opacity-90" />
    <Image src="/stratos-logo.svg" alt="Stratos" width={160} height={32} className="opacity-90" />
  </Link>
)

const NavLink = ({ text, active = false, href = "#" }: { text: string; active?: boolean; href?: string }) => (
  <Link
    href={href}
    className={`tracking-[0.15em] uppercase transition-colors duration-300 font-medium text-lg ${
      active ? "text-[#ccff00]" : "text-gray-400 hover:text-white"
    }`}
  >
    {text}
  </Link>
)

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isHome = pathname === "/"
  const isMarketplace = pathname === "/agents"
  const isCreate = pathname === "/create"
  const isLearn = pathname === "/learn"
  const isPortfolio = pathname === "/portfolio"

  const marketplaceActive = (isHome || isMarketplace || isCreate) && !isLearn

  return (
    <>
      <nav className="border-b bg-black/90 backdrop-blur-md border-gray-800 py-3 z-50 fixed top-0 left-0 right-0">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <StratosLogo />
            <NavLink text="MARKETPLACE" active={marketplaceActive} href="/agents" />
          </div>

          <div className="hidden md:flex items-center gap-12">
            <NavLink text="Agents" active={isMarketplace} href="/agents" />
            <NavLink text="Create" active={isCreate} href="/create" />
            <NavLink text="Portfolio" active={isPortfolio} href="/portfolio" />
            <NavLink text="Learn" active={isLearn} href="/learn" />
            <WalletButton />
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <div className="pt-20" />

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center gap-8 md:hidden">
          <NavLink text="MARKETPLACE" active={marketplaceActive} href="/agents" />
          <NavLink text="Agents" active={isMarketplace} href="/agents" />
          <NavLink text="Create" active={isCreate} href="/create" />
          <NavLink text="Portfolio" active={isPortfolio} href="/portfolio" />
          <NavLink text="Learn" active={isLearn} href="/learn" />
          <WalletButton />
        </div>
      )}
    </>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem("cookie-consent", "all")
    setShowBanner(false)
    // Initialize analytics and other optional cookies here
    console.log("[v0] User accepted all cookies")
  }

  const handleAcceptEssential = () => {
    localStorage.setItem("cookie-consent", "essential")
    setShowBanner(false)
    // Only essential cookies will be used
    console.log("[v0] User accepted essential cookies only")
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950 border-t border-gray-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-white font-bold mb-2 text-sm">We value your privacy</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By
              clicking "Accept All", you consent to our use of cookies. You can manage your preferences at any time.{" "}
              <Link href="/legal" className="text-[#ccff00] hover:underline">
                Learn more
              </Link>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button
              onClick={handleAcceptEssential}
              variant="outline"
              className="text-xs font-bold uppercase tracking-wider border-gray-700 hover:bg-gray-800 text-white"
            >
              Essential Only
            </Button>
            <Button
              onClick={handleAcceptAll}
              className="bg-[#ccff00] text-black hover:bg-[#b8e600] text-xs font-bold uppercase tracking-wider"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

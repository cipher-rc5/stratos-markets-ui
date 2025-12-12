"use client"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-900 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/stratos-rook.svg" alt="Stratos" width={32} height={32} className="invert" />
            <Image src="/stratos-logo.svg" alt="Stratos" width={120} height={32} />
          </Link>
          <Link
            href="/"
            className="bg-[#ccff00] text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#b8e600] transition-colors"
          >
            Launch
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-20">
        <h1 className="text-4xl font-bold font-['Orbitron'] mb-8">Legal Information</h1>

        <Tabs defaultValue="terms" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 mb-12">
            <TabsTrigger value="terms" className="data-[state=active]:bg-[#ccff00] data-[state=active]:text-black">
              Terms of Service
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-[#ccff00] data-[state=active]:text-black">
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger value="cookies" className="data-[state=active]:bg-[#ccff00] data-[state=active]:text-black">
              Cookie Policy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="terms">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-8">Last Updated: December 2025</div>
            <div className="space-y-8 text-gray-400 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using the Stratos platform, you agree to be bound by these Terms of Service and all
                  applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from
                  using or accessing this platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4">2. Use License</h2>
                <p>
                  Permission is granted to temporarily access the materials on Stratos for personal, non-commercial
                  transitory viewing only. This is the grant of a license, not a transfer of title, and under this
                  license you may not modify or copy the materials, use the materials for any commercial purpose, or
                  attempt to decompile or reverse engineer any software contained on the platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4">3. Trading Risks</h2>
                <p>
                  Trading cryptocurrencies and DeFi strategies carries substantial risk of loss. Past performance does
                  not guarantee future results. You acknowledge that you are solely responsible for all trading
                  decisions and that Stratos is not liable for any losses incurred through the use of strategies
                  deployed on the platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4">4. User Responsibilities</h2>
                <p>
                  You are responsible for maintaining the confidentiality of your account credentials, for all
                  activities that occur under your account, and for ensuring that all uses of your account comply fully
                  with the provisions of these Terms of Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4">5. Intellectual Property</h2>
                <p>
                  The platform and its original content, features, and functionality are owned by Stratos and are
                  protected by international copyright, trademark, and other intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4">6. Limitation of Liability</h2>
                <p>
                  In no event shall Stratos or its suppliers be liable for any damages arising out of the use or
                  inability to use the materials on the platform, even if Stratos or an authorized representative has
                  been notified of the possibility of such damage.
                </p>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="privacy">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-8">Last Updated: December 2025</div>
            <div className="space-y-8 text-gray-400 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
                <p>
                  We collect information that you provide directly to us, including when you create an account, use our
                  services, participate in interactive features, or communicate with us. This may include wallet
                  addresses, transaction data, and usage information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                <p>
                  We use the information we collect to provide, maintain, and improve our services, to process
                  transactions, to send you technical notices and support messages, and to communicate with you about
                  products, services, and events.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4">3. Information Sharing</h2>
                <p>
                  We do not share your personal information with third parties except as described in this policy. We
                  may share information with service providers who perform services on our behalf, in response to legal
                  requests, or to protect rights and safety.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4">4. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect the security of your
                  personal information. However, no method of transmission over the Internet or electronic storage is
                  100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4">5. Blockchain Transparency</h2>
                <p>
                  Please note that transactions on blockchain networks are public by design. While we take measures to
                  protect your privacy, blockchain transactions and wallet addresses are visible on public ledgers.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4">6. Your Rights Under GDPR</h2>
                <p>
                  If you are a resident of the European Economic Area (EEA), you have certain data protection rights
                  under the General Data Protection Regulation (GDPR):
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
                  <li>
                    <strong className="text-white">Right to Access:</strong> You can request access to your personal
                    data
                  </li>
                  <li>
                    <strong className="text-white">Right to Rectification:</strong> You can request correction of
                    inaccurate data
                  </li>
                  <li>
                    <strong className="text-white">Right to Erasure:</strong> You can request deletion of your personal
                    data
                  </li>
                  <li>
                    <strong className="text-white">Right to Restrict Processing:</strong> You can request limitation of
                    data processing
                  </li>
                  <li>
                    <strong className="text-white">Right to Data Portability:</strong> You can request transfer of your
                    data
                  </li>
                  <li>
                    <strong className="text-white">Right to Object:</strong> You can object to processing of your
                    personal data
                  </li>
                  <li>
                    <strong className="text-white">Right to Withdraw Consent:</strong> You can withdraw consent at any
                    time
                  </li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact us at privacy@stratos.markets. We will respond to your
                  request within 30 days.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4">7. International Data Transfers</h2>
                <p>
                  Your information may be transferred to and processed in countries other than your country of
                  residence. We ensure appropriate safeguards are in place for such transfers in compliance with GDPR
                  requirements.
                </p>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="cookies">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-8">Last Updated: December 2025</div>
            <div className="space-y-8 text-gray-400 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-white mb-4">1. What Are Cookies</h2>
                <p>
                  Cookies are small text files that are placed on your device when you visit our platform. They help us
                  provide you with a better experience by remembering your preferences and understanding how you use our
                  services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4">2. How We Use Cookies</h2>
                <p>We use cookies for various purposes, including:</p>
                <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
                  <li>Essential cookies for platform functionality</li>
                  <li>Performance cookies to analyze platform usage</li>
                  <li>Functional cookies to remember your preferences</li>
                  <li>Analytics cookies to improve our services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4">3. Types of Cookies We Use</h2>
                <div className="space-y-4">
                  <div>
                    <p className="font-bold text-white mb-2">Essential Cookies (Always Active)</p>
                    <p>
                      These cookies are necessary for the platform to function and cannot be disabled. They include
                      session management, security features, and wallet connectivity.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-white mb-2">Analytics Cookies (Optional)</p>
                    <p>
                      These cookies help us understand how users interact with the platform, allowing us to improve
                      functionality and user experience. You can opt-out of these cookies.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-white mb-2">Functional Cookies (Optional)</p>
                    <p>
                      These cookies enable enhanced functionality and personalization, such as remembering your
                      preferences and settings.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4">4. Managing Cookie Preferences</h2>
                <p>
                  You can control and manage cookies through your browser settings or using our cookie consent banner.
                  You can also manage your preferences at any time by clicking "Cookie Preferences" in the footer.
                </p>
                <p className="mt-4">
                  Please note that disabling certain cookies may affect the functionality of the platform and your
                  ability to use certain features.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4">5. Third-Party Cookies</h2>
                <p>
                  We may use third-party service providers who also set cookies on your device to provide their services
                  (such as analytics). These providers have their own privacy policies governing the use of cookies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4">6. Updates to This Policy</h2>
                <p>
                  We may update this Cookie Policy from time to time. We will notify you of any changes by posting the
                  new policy on this page and updating the "Last Updated" date.
                </p>
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

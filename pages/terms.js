import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

export default function Terms() {
	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<Navigation />
			<main className="flex-1">
				<div className="max-w-4xl mx-auto px-4 py-10">
					<h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
					<div className="space-y-6 bg-white border rounded-lg p-6">
						<section>
							<h2 className="font-semibold mb-2">1. Eligibility</h2>
							<p>You must be at least 18 years old to use our Services. Drivers must hold a valid driving license and provide accurate documentation during registration. Clients must provide truthful details when hiring drivers.</p>
						</section>
						<section>
							<h2 className="font-semibold mb-2">2. Account Registration</h2>
							<p>You agree to provide accurate, complete, and up-to-date information. You are responsible for maintaining the confidentiality of your account and password. You may not impersonate another person or create multiple fake accounts.</p>
						</section>
						<section>
							<h2 className="font-semibold mb-2">3. Use of Services</h2>
							<p>Drivers may create profiles, upload documents, and offer their services. Clients may browse, contact, and hire drivers through the platform. You agree not to misuse the platform for fraudulent, illegal, or harmful purposes.</p>
						</section>
						<section>
							<h2 className="font-semibold mb-2">4. Payments</h2>
							<p>Payments between clients and drivers may be arranged directly or through integrated payment options (when available). EasyDriverHire is not responsible for disputes arising from payments made outside the platform. Service fees (if applicable) will be clearly communicated before transactions.</p>
						</section>
						<section>
							<h2 className="font-semibold mb-2">5. Safety & Conduct</h2>
							<p>Users must follow our Safety Guidelines at all times. Harassment, discrimination, or abuse will not be tolerated. We reserve the right to suspend or terminate accounts that violate these Terms.</p>
						</section>
						<section>
							<h2 className="font-semibold mb-2">6. Content & Data</h2>
							<p>You retain ownership of the content you upload (e.g., photos, documents). By uploading, you grant EasyDriverHire a limited license to display your content for service purposes. Do not upload false, misleading, or harmful content.</p>
						</section>
						<section>
							<h2 className="font-semibold mb-2">7. Disclaimers</h2>
							<p>EasyDriverHire is a platform only. We do not employ drivers or guarantee the conduct of clients. We are not liable for accidents, damages, or disputes arising between drivers and clients. Users are responsible for verifying the authenticity and suitability of engagements.</p>
						</section>
						<section>
							<h2 className="font-semibold mb-2">8. Limitation of Liability</h2>
							<p>EasyDriverHire shall not be liable for indirect, incidental, or consequential damages. Our total liability will not exceed the amount paid (if any) by you to us within the last 6 months.</p>
						</section>
						<section>
							<h2 className="font-semibold mb-2">9. Termination</h2>
							<p>We may suspend or terminate your account if you breach these Terms. You may delete your account at any time.</p>
						</section>
						<section>
							<h2 className="font-semibold mb-2">10. Changes to Terms</h2>
							<p>We may update these Terms from time to time. Continued use of the Services after updates means you accept the new Terms.</p>
						</section>
						<section>
							<h2 className="font-semibold mb-2">11. Governing Law</h2>
							<p>These Terms are governed by the laws of Kenya. Any disputes will be resolved in the courts of Kenya.</p>
						</section>
						<div className="pt-2">
							<a href="/safety" className="text-blue-600 hover:underline">View Safety Guidelines</a>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	)
}
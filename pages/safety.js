import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

export default function Safety() {
	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<Navigation />
			<main className="flex-1">
				<div className="max-w-4xl mx-auto px-4 py-10">
					<h1 className="text-3xl font-bold mb-6">EasyDriverHire Safety Guidelines</h1>
					<div className="space-y-6 bg-white border rounded-lg p-6">
						<section>
							<h2 className="font-semibold mb-2">For Drivers</h2>
							<ul className="list-disc ml-6 space-y-1 text-gray-800">
								<li>Complete your profile with accurate details, a clear photo, and valid documents.</li>
								<li>Keep your license, ID, and certifications up to date.</li>
								<li>Meet clients for the first time in public/safe locations.</li>
								<li>Report suspicious activity or unsafe requests via the app.</li>
								<li>Follow road safety rules and stay professional at all times.</li>
							</ul>
						</section>
						<section>
							<h2 className="font-semibold mb-2">For Clients (Employers)</h2>
							<ul className="list-disc ml-6 space-y-1 text-gray-800">
								<li>Verify driver profiles, ratings, and documents before hiring.</li>
								<li>Arrange first meetings in public or secure areas.</li>
								<li>Avoid cash; prefer digital or official payment methods.</li>
								<li>Treat drivers fairly and report any misconduct via the platform.</li>
								<li>Trust your instincts—if unsure, do not proceed.</li>
							</ul>
						</section>
						<section>
							<h2 className="font-semibold mb-2">General Safety Tips</h2>
							<ul className="list-disc ml-6 space-y-1 text-gray-800">
								<li>Keep communication within EasyDriverHire; avoid sharing unnecessary personal contact info early.</li>
								<li>Tell a friend/family member when meeting someone new.</li>
								<li>Use Report & Block to alert us of bad actors.</li>
								<li>We will never ask for your password, OTP, or payment details outside the app.</li>
							</ul>
						</section>
						<div className="pt-2">
							<a href="/terms" className="text-blue-600 hover:underline">Read Terms of Service</a>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	)
}


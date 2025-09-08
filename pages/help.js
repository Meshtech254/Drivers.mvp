import { useState, useMemo } from 'react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

const faqs = [
	{
		q: 'What is EasyDriverHire?',
		a: 'EasyDriverHire connects drivers with individuals and businesses looking to hire them. Clients can browse, hire, and review drivers, while drivers can showcase their skills and find work opportunities.'
	},
	{
		q: 'How do I sign up as a driver?',
		a: 'Go to the Sign Up page, provide your details, upload your documents (ID, driving license, etc.), and set up your profile. Once approved, your profile will be visible to clients.'
	},
	{
		q: 'How do I hire a driver?',
		a: 'Visit the Browse Drivers section, filter by location, skills, or experience, then contact the driver directly or send a hire request through the platform.'
	},
	{
		q: 'Is EasyDriverHire free to use?',
		a: 'Signing up is free for both drivers and clients. Service fees may apply for premium features such as profile boosts, priority listings, or verified driver badges.'
	},
	{
		q: 'How do payments work?',
		a: 'Clients and drivers can agree on payment terms directly. For more security, we are working on integrating in-app payments.'
	},
	{
		q: 'What documents do drivers need?',
		a: 'A valid driving license and a National ID or Passport. Optional documents like a Certificate of Good Conduct, PSV license, or references can increase trust.'
	},
	{
		q: 'How do I reset my password or log back in?',
		a: 'If you registered with email, you will receive a Magic Link to log in. If you registered with Google or GitHub (coming soon), you can log in with one click.'
	},
	{
		q: 'Can I upload a profile picture?',
		a: 'Yes. Drivers are encouraged to upload a clear and professional photo to increase trust with clients.'
	},
	{
		q: 'What if I encounter a problem with a driver/client?',
		a: 'Report the issue through our Help & Support section. We will investigate and may suspend accounts that violate our Terms of Service.'
	},
	{
		q: 'Is my data safe on EasyDriverHire?',
		a: 'Yes. We follow strict data protection policies. Your data is stored securely and never shared without your consent.'
	}
]

export default function HelpCenter() {
	const [messages, setMessages] = useState([
		{ role: 'assistant', content: 'Hi! I\'m your Help Center assistant. Ask me about EasyDriverHire or pick a question below.' }
	])
	const [input, setInput] = useState('')

	const suggestions = useMemo(() => faqs.slice(0, 6), [])

	const findAnswer = (text) => {
		const normalized = text.toLowerCase()
		const match = faqs.find(({ q }) => normalized.includes(q.toLowerCase().split('?')[0]))
		if (match) return match.a
		// simple keyword routing
		if (/(sign\s?up|register|driver)/i.test(text)) return faqs[1].a
		if (/(hire|browse)/i.test(text)) return faqs[2].a
		if (/(free|price|fees)/i.test(text)) return faqs[3].a
		if (/(payment|pay|paid)/i.test(text)) return faqs[4].a
		if (/(document|license|id|passport)/i.test(text)) return faqs[5].a
		if (/(reset|password|login|magic)/i.test(text)) return faqs[6].a
		if (/(photo|picture|profile)/i.test(text)) return faqs[7].a
		if (/(problem|issue|report|support)/i.test(text)) return faqs[8].a
		if (/(data|privacy|safe|security)/i.test(text)) return faqs[9].a
		return 'I could not find an exact answer. Please pick a question below or contact support.'
	}

	const handleAsk = (text) => {
		if (!text.trim()) return
		const userMsg = { role: 'user', content: text.trim() }
		const answer = findAnswer(text.trim())
		const botMsg = { role: 'assistant', content: answer }
		setMessages((prev) => [...prev, userMsg, botMsg])
		setInput('')
	}

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<Navigation />
			<main className="flex-1">
				<div className="max-w-4xl mx-auto px-4 py-10">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
					<p className="text-gray-600 mb-6">Ask a question or choose from the FAQs. Need more help? Contact support.</p>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="md:col-span-2 bg-white rounded-lg shadow border border-gray-100 flex flex-col">
							<div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: 420 }}>
								{messages.map((m, idx) => (
									<div key={idx} className={m.role === 'assistant' ? 'text-gray-800' : 'text-gray-900'}>
										<div className={m.role === 'assistant' ? 'bg-blue-50 inline-block px-3 py-2 rounded-lg' : 'bg-gray-100 inline-block px-3 py-2 rounded-lg'}>
											{m.content}
										</div>
									</div>
								))}
							</div>
							<div className="border-t border-gray-100 p-3 flex space-x-2">
								<input
									type="text"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									placeholder="Type your question..."
									className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<button onClick={() => handleAsk(input)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Ask</button>
								<a href="mailto:easydriverhire1@gmail.com" className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">Contact Support</a>
							</div>
						</div>

						<div className="space-y-3">
							<h2 className="text-lg font-semibold">Popular FAQs</h2>
							{suggestions.map((s, i) => (
								<button key={i} onClick={() => handleAsk(s.q)} className="w-full text-left px-3 py-2 bg-white border rounded-md hover:bg-gray-50">
									<span className="font-medium">{s.q}</span>
								</button>
							))}
							<div className="pt-2">
								<a href="/terms" className="text-blue-600 hover:underline mr-4">Terms of Service</a>
								<a href="/safety" className="text-blue-600 hover:underline">Safety Guidelines</a>
							</div>
						</div>
					</div>

					<div className="mt-10">
						<h2 className="text-2xl font-bold mb-4">All FAQs</h2>
						<div className="space-y-4">
							{faqs.map((f, i) => (
								<div key={i} className="bg-white border rounded-lg p-4">
									<p className="font-semibold">{f.q}</p>
									<p className="text-gray-700 mt-1">{f.a}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	)
}



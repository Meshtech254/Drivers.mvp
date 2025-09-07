import { useState } from 'react'

const faqs = [
  {
    q: "What is EasyDriverHire?",
    a: "EasyDriverHire is a platform that connects drivers with individuals and businesses looking to hire them. Clients can browse, hire, and review drivers, while drivers can showcase their skills and find work opportunities."
  },
  {
    q: "How do I sign up as a driver?",
    a: "Go to the Sign Up page. Provide your details, upload your documents (ID, driving license, etc.), and set up your profile. Once approved, your profile will be visible to clients."
  },
  {
    q: "How do I hire a driver?",
    a: "Visit the Browse Drivers section. Filter by location, skills, or experience. Contact the driver directly or send a hire request through the platform."
  },
  {
    q: "Is EasyDriverHire free to use?",
    a: "Signing up is free for both drivers and clients. Service fees may apply for premium features (e.g., profile boosts, priority listings, or verified driver badges)."
  },
  {
    q: "How do payments work?",
    a: "Clients and drivers can agree on payment terms directly. For more security, we’re working on integrating in-app payments."
  },
  {
    q: "What documents do drivers need?",
    a: "A valid driving license. National ID or Passport. Optional: Certificate of Good Conduct, PSV license, or references (to increase trust)."
  },
  {
    q: "How do I reset my password or log back in?",
    a: "If you registered with email, you’ll receive a Magic Link to log in. If you registered with Google or GitHub (coming soon), you can log in with one click."
  },
  {
    q: "Can I upload a profile picture?",
    a: "Yes! Drivers are encouraged to upload a clear and professional photo to increase trust with clients."
  },
  {
    q: "What if I encounter a problem with a driver/client?",
    a: "Report the issue through our Help & Support section. We will investigate and may suspend accounts that violate our Terms of Service."
  },
  {
    q: "Is my data safe on EasyDriverHire?",
    a: "Yes. We follow strict data protection policies. Your data is stored securely and never shared without your consent."
  }
]

export default function SupportLinks() {
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState('')

  const handleAsk = () => {
    const found = faqs.find(f => f.q.toLowerCase().includes(query.toLowerCase()))
    setAnswer(found ? found.a : "Sorry, I don't have an answer for that. Please contact support.")
  }

  return (
    <div style={{margin: '24px 0', padding: 16, border: '1px solid #eee', borderRadius: 8}}>
      <h3>Support & Help Center</h3>
      <input
        type="text"
        placeholder="Ask a question (e.g., How do I sign up?)"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{width: '80%', marginRight: 8}}
      />
      <button onClick={handleAsk}>Ask</button>
      {answer && <div style={{marginTop: 12, color: '#333'}}>{answer}</div>}
      <div style={{marginTop: 16}}>
        <a href="mailto:support@easydriverhire.com" style={{marginRight: 16}}>Contact Support</a>
        <a href="/terms" style={{marginRight: 16}}>Terms of Service</a>
        <a href="/safety">Safety Guidelines</a>
      </div>
    </div>
  )
}
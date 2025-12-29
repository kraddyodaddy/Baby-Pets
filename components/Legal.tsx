import React from 'react';

// Common wrapper for legal pages
const LegalLayout = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <main className="max-w-3xl mx-auto px-6 py-16 animate-fade-in min-h-[60vh]">
    <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b border-brand-100 pb-4">
      {title}
    </h1>
    <div className="prose prose-pink prose-lg text-gray-600 max-w-none">
      {children}
    </div>
  </main>
);

export const AboutPage = ({ onNavigate }: { onNavigate?: (view: any) => void }) => (
  <LegalLayout title="About Us">
    <p className="text-xl text-gray-700 leading-relaxed mb-6 font-medium">
      Welcome to <strong>BabyPets.ai</strong>, your premier destination for reimagining your beloved pets as their adorable baby selves.
    </p>

    <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Our Story</h2>
    <p>
      BabyPets was born from a simple, heartwarming thought: "What did my rescue dog look like as a puppy?" For many pet owners, especially those who adopted adult animals, the early days of their furry friends remain a mystery. For others, seeing their senior cat as a tiny kitten again brings back a flood of cherished memories.
    </p>
    <p>
      We built this tool to bridge that gap between the past and present, bringing a spark of joy and nostalgia to pet lovers around the world. We believe that technology, when applied with creativity and care, can deepen the emotional bond we share with our animal companions.
    </p>

    <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">How The Magic Happens</h2>
    <p>
      Behind the cute interface lies sophisticated technology. BabyPets utilizes Google's advanced Gemini generative AI models. When you upload a photo, our system performs a complex analysis of your pet's key features—identifying fur patterns, eye color, snout shape, and ear positioning.
    </p>
    <p>
      The AI then applies a "conceptual age regression" process. It doesn't just shrink the image; it structurally reimagines the subject with juvenile proportions—larger eyes, softer features, rounder paws, and fluffier coats—while meticulously preserving the unique markings that make your pet who they are.
    </p>

    <p className="mt-8">
      We are proud to offer this service completely free of charge. To keep the servers running and the magic flowing, our site is supported by non-intrusive advertising. Thank you for being part of our community!
    </p>
  </LegalLayout>
);

export const FAQPage = () => (
  <LegalLayout title="Frequently Asked Questions">
    <div className="space-y-8">
      <div>
        <h2 className="font-bold text-gray-900 text-xl mb-2">How does BabyPets work?</h2>
        <p>BabyPets uses state-of-the-art Artificial Intelligence to analyze your photo. It detects the animal subject and generates a new image that represents how that specific animal might look as a baby, maintaining their identity.</p>
      </div>

      <div>
        <h2 className="font-bold text-gray-900 text-xl mb-2">Is it really free?</h2>
        <p>Yes! BabyPets.ai is 100% free to use. We are able to provide this service thanks to the advertisements displayed on our website, which cover our server and AI processing costs.</p>
      </div>

      <div>
        <h2 className="font-bold text-gray-900 text-xl mb-2">What types of pets can I transform?</h2>
        <p>Our AI is trained primarily on dogs and cats, as these produce the most accurate results. However, it can handle rabbits, hamsters, and guinea pigs too!</p>
      </div>

      <div>
        <h2 className="font-bold text-gray-900 text-xl mb-2">What makes a good photo?</h2>
        <p>Use a clear, well-lit photo taken at eye level. Front-facing portraits usually yield the most adorable "baby" faces.</p>
      </div>

      <div>
        <h2 className="font-bold text-gray-900 text-xl mb-2">Do you keep my photos?</h2>
        <p><strong>No.</strong> Photos are uploaded solely for the transformation process and are not permanently stored on our servers.</p>
      </div>

      <div>
        <h2 className="font-bold text-gray-900 text-xl mb-2">Is there a daily limit?</h2>
        <p>To ensure the service remains fast for everyone, we currently limit usage to 10 transformations per day per user.</p>
      </div>
    </div>
  </LegalLayout>
);

export const PrivacyPage = () => (
  <LegalLayout title="Privacy Policy">
    <p className="text-sm text-gray-500 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
    
    <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">1. Introduction</h2>
    <p>
      At BabyPets.ai, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our website.
    </p>

    <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. Information We Collect</h2>
    <ul className="list-disc pl-5 mb-4 space-y-2">
      <li><strong>User-Provided Content:</strong> Images you upload specifically for transformation.</li>
      <li><strong>Usage Data:</strong> Anonymous information about site access via Google Analytics.</li>
      <li><strong>Cookies:</strong> Facilitate advertising and analytics services.</li>
    </ul>

    <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. Data Retention</h2>
    <p>
      <strong>We do not retain your personal photos.</strong> Images are transmitted securely to Google Gemini API for generation and discarded once complete.
    </p>

    <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">4. Third-Party Services</h2>
    <p>
      We use Google Analytics for traffic reporting and Google AdSense for advertisements.
    </p>

    <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">5. Contact Us</h2>
    <p>
      Contact us at: <a href="mailto:babypetsai@gmail.com" className="text-brand-600 hover:underline">babypetsai@gmail.com</a>.
    </p>
  </LegalLayout>
);

export const TermsPage = () => (
  <LegalLayout title="Terms of Service">
    <p className="text-sm text-gray-500 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
    
    <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">1. Agreement to Terms</h2>
    <p>
      By accessing BabyPets.ai, you agree to be bound by these Terms of Service.
    </p>

    <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. Use License</h2>
    <p>
      Permission is granted for personal, non-commercial transitory viewing and image generation.
    </p>

    <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. User Responsibilities</h2>
    <p>
      You warrant that you own or have necessary rights to any photos you upload.
    </p>

    <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">4. Limitations</h2>
    <p>
      BabyPets.ai is provided "as is" without warranties of any kind.
    </p>

    <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">5. Contact</h2>
    <p>
      Questions? Send them to <a href="mailto:babypetsai@gmail.com" className="text-brand-600 hover:underline">babypetsai@gmail.com</a>.
    </p>
  </LegalLayout>
);

export const ContactPage = () => (
  <LegalLayout title="Contact Us">
    <p className="text-lg text-gray-700 mb-8">
      We'd love to hear from you! Reach out for feedback, support, or partnership opportunities.
    </p>

    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <h2 className="font-bold text-gray-900 text-xl mb-4">Get in Touch</h2>
        <div className="space-y-4 text-gray-600">
          <p>
            <strong>Email:</strong><br/>
            <a href="mailto:babypetsai@gmail.com" className="text-brand-600 hover:underline">babypetsai@gmail.com</a>
          </p>
          <p>
            <strong>Response Time:</strong><br/>
            We aim to respond within 24-48 hours.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <form onSubmit={(e) => { e.preventDefault(); alert("Thanks for your message!"); }}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" id="name" className="w-full rounded-lg border-gray-300 border p-2 focus:border-brand-500 outline-none" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="email" className="w-full rounded-lg border-gray-300 border p-2 focus:border-brand-500 outline-none" required />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea id="message" rows={4} className="w-full rounded-lg border-gray-300 border p-2 focus:border-brand-500 outline-none" required></textarea>
            </div>
            <button type="submit" className="w-full bg-brand-500 text-white font-bold py-3 rounded-lg hover:bg-brand-600 transition-colors">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  </LegalLayout>
);
import React from 'react';

// Common wrapper for legal pages
const LegalLayout = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <div className="max-w-3xl mx-auto px-6 py-16 animate-fade-in min-h-[60vh]">
    <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b border-brand-100 pb-4">
      {title}
    </h1>
    <div className="prose prose-pink prose-lg text-gray-600 max-w-none">
      {children}
    </div>
  </div>
);

export const AboutPage = ({ onNavigate }: { onNavigate?: (view: any) => void }) => (
  <LegalLayout title="About Us">
    <p className="text-xl text-gray-700 leading-relaxed mb-6 font-medium">
      Welcome to <strong>BabyPets.ai</strong>, your premier destination for reimagining your beloved pets as their adorable baby selves.
    </p>

    <h3>Our Story</h3>
    <p>
      BabyPets was born from a simple, heartwarming thought: "What did my rescue dog look like as a puppy?" For many pet owners, especially those who adopted adult animals, the early days of their furry friends remain a mystery. For others, seeing their senior cat as a tiny kitten again brings back a flood of cherished memories.
    </p>
    <p>
      We built this tool to bridge that gap between the past and present, bringing a spark of joy and nostalgia to pet lovers around the world. We believe that technology, when applied with creativity and care, can deepen the emotional bond we share with our animal companions.
    </p>

    <h3>How The Magic Happens</h3>
    <p>
      Behind the cute interface lies sophisticated technology. BabyPets utilizes Google's advanced Gemini generative AI models. When you upload a photo, our system performs a complex analysis of your pet's key features—identifying fur patterns, eye color, snout shape, and ear positioning.
    </p>
    <p>
      The AI then applies a "conceptual age regression" process. It doesn't just shrink the image; it structurally reimagines the subject with juvenile proportions—larger eyes, softer features, rounder paws, and fluffier coats—while meticulously preserving the unique markings that make your pet who they are. The result is a hyper-realistic glimpse into the past (or a cute alternate reality!).
    </p>

    <p>
      We are proud to offer this service completely free of charge. To keep the servers running and the magic flowing, our site is supported by non-intrusive advertising. Thank you for being part of our community!
    </p>
  </LegalLayout>
);

export const FAQPage = () => (
  <LegalLayout title="Frequently Asked Questions">
    <div className="space-y-8">
      <div>
        <h3 className="font-bold text-gray-900 text-xl mb-2">How does BabyPets work?</h3>
        <p>BabyPets uses state-of-the-art Artificial Intelligence to analyze your photo. It detects the animal subject and generates a new image that represents how that specific animal might look as a baby (puppy, kitten, etc.), maintaining their color pattern and identity.</p>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 text-xl mb-2">Is it really free?</h3>
        <p>Yes! BabyPets.ai is 100% free to use. We are able to provide this service thanks to the advertisements displayed on our website, which cover our server and AI processing costs.</p>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 text-xl mb-2">What types of pets can I transform?</h3>
        <p>Our AI is trained primarily on <strong>dogs and cats</strong>, as these produce the most accurate results. However, it can often handle other mammals like rabbits, hamsters, and guinea pigs with varying degrees of cuteness!</p>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 text-xl mb-2">What makes a good photo?</h3>
        <p>For the best results, use a <strong>clear, well-lit photo</strong> taken at eye level. The pet's face should be fully visible and not obscured by objects. Front-facing portraits usually yield the most adorable "baby" faces.</p>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 text-xl mb-2">How long does the transformation take?</h3>
        <p>Typically, it takes about <strong>5 to 10 seconds</strong> for the AI to generate your image. It may take slightly longer during periods of high demand.</p>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 text-xl mb-2">Do you keep my photos?</h3>
        <p><strong>No.</strong> Your privacy is important. Photos are uploaded solely for the purpose of the transformation process and are not permanently stored on our servers. We do not build a database of user photos.</p>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 text-xl mb-2">Can I download and share the results?</h3>
        <p>Yes! You have full rights to download the generated images for personal use. We encourage you to share them on social media—we love seeing your baby pets!</p>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 text-xl mb-2">Is there a limit to how many I can make?</h3>
        <p>To ensure the service remains available and fast for everyone, we currently limit usage to <strong>10 transformations per day</strong> per user.</p>
      </div>
    </div>
  </LegalLayout>
);

export const PrivacyPage = () => (
  <LegalLayout title="Privacy Policy">
    <p className="text-sm text-gray-500 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
    
    <h3>1. Introduction</h3>
    <p>
      At BabyPets.ai, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our website. By using our service, you agree to the collection and use of information in accordance with this policy.
    </p>

    <h3>2. Information We Collect</h3>
    <ul className="list-disc pl-5 mb-4 space-y-2">
      <li><strong>User-Provided Content:</strong> We collect the images you upload specifically for the purpose of generating AI transformations.</li>
      <li><strong>Usage Data:</strong> We may collect anonymous information about how the Service is accessed and used (e.g., page views, time spent on site) via Google Analytics.</li>
      <li><strong>Cookies:</strong> We use cookies to store session preferences and to facilitate advertising and analytics services.</li>
    </ul>

    <h3>3. How We Use Your Data</h3>
    <p>
      We use the collected data for the following purposes:
    </p>
    <ul className="list-disc pl-5 mb-4 space-y-2">
      <li>To provide and maintain the BabyPets service.</li>
      <li>To detect, prevent, and address technical issues.</li>
      <li>To monitor the usage of the Service to improve user experience.</li>
      <li>To serve relevant advertisements via Google AdSense.</li>
    </ul>

    <h3>4. Data Retention & Images</h3>
    <p>
      <strong>We do not retain your personal photos.</strong> Images uploaded for processing are transmitted securely to our AI provider (Google Gemini API) for the sole purpose of generation and are not stored permanently by BabyPets.ai. Once the session is closed or the transformation is complete, the data is discarded from our immediate processing memory.
    </p>

    <h3>5. Third-Party Service Providers</h3>
    <p>
      We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, or to assist us in analyzing how our Service is used.
    </p>
    <ul className="list-disc pl-5 mb-4 space-y-2">
      <li><strong>Google Analytics:</strong> We use Google Analytics to track and report website traffic.</li>
      <li><strong>Google AdSense:</strong> We use Google AdSense to display ads. Google may use cookies to serve ads based on your prior visits to our website or other websites.</li>
      <li><strong>Google Gemini API:</strong> We use Google's generative AI to process image transformations.</li>
    </ul>

    <h3>6. Children's Privacy</h3>
    <p>
      Our Service does not address anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 13.
    </p>

    <h3>7. Contact Us</h3>
    <p>
      If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:babypetsai@gmail.com" className="text-brand-600 hover:underline">babypetsai@gmail.com</a>.
    </p>
  </LegalLayout>
);

export const TermsPage = () => (
  <LegalLayout title="Terms of Service">
    <p className="text-sm text-gray-500 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
    
    <h3>1. Agreement to Terms</h3>
    <p>
      By accessing or using BabyPets.ai, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
    </p>

    <h3>2. Use License</h3>
    <p>
      Permission is granted to temporarily use BabyPets.ai for personal, non-commercial transitory viewing and image generation. Under this license, you may not:
    </p>
    <ul className="list-disc pl-5 mb-4 space-y-2">
      <li>Use the materials for any commercial purpose without express written consent.</li>
      <li>Attempt to decompile or reverse engineer any software contained on the website.</li>
      <li>Remove any copyright or other proprietary notations from the materials.</li>
      <li>Upload content that is illegal, offensive, pornographic, or infringing on intellectual property rights.</li>
    </ul>

    <h3>3. User Responsibilities</h3>
    <p>
      You are responsible for the content you upload. You warrant that you own or have the necessary licenses, rights, consents, and permissions to use and authorize BabyPets.ai to use all intellectual property rights in and to any photos you upload.
    </p>

    <h3>4. Disclaimer</h3>
    <p>
      The materials on BabyPets.ai are provided on an "as is" basis. BabyPets.ai makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
    </p>

    <h3>5. Limitations</h3>
    <p>
      In no event shall BabyPets.ai or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on BabyPets.ai.
    </p>

    <h3>6. Governing Law</h3>
    <p>
      These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
    </p>

    <h3>7. Contact Information</h3>
    <p>
      Questions about the Terms of Service should be sent to us at <a href="mailto:babypetsai@gmail.com" className="text-brand-600 hover:underline">babypetsai@gmail.com</a>.
    </p>
  </LegalLayout>
);

export const ContactPage = () => (
  <LegalLayout title="Contact Us">
    <p className="text-lg text-gray-700 mb-8">
      We'd love to hear from you! Whether you have feedback on the AI results, need technical support, or are interested in partnership opportunities, please don't hesitate to reach out.
    </p>

    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <h3 className="font-bold text-gray-900 text-xl mb-4">Get in Touch</h3>
        <div className="space-y-4 text-gray-600">
          <p>
            <strong>Email:</strong><br/>
            <a href="mailto:babypetsai@gmail.com" className="text-brand-600 hover:underline">babypetsai@gmail.com</a>
          </p>
          <p>
            <strong>Response Time:</strong><br/>
            We aim to respond to all valid inquiries within <strong>24-48 hours</strong>.
          </p>
          <p>
            <strong>Common Inquiries:</strong><br/>
            • Technical Support & Bug Reports<br/>
            • Privacy Concerns<br/>
            • Feedback & Feature Requests<br/>
            • Advertising & Partnerships
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <form onSubmit={(e) => { e.preventDefault(); alert("Thanks for your message! We'll get back to you shortly."); }}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" id="name" className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none transition-all" placeholder="Your name" required />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="email" className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none transition-all" placeholder="you@example.com" required />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea id="message" rows={4} className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none transition-all" placeholder="How can we help?" required></textarea>
            </div>

            <button type="submit" className="w-full bg-brand-500 text-white font-bold py-3 rounded-lg hover:bg-brand-600 transition-colors shadow-sm">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  </LegalLayout>
);
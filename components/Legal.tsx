import React from 'react';

// Common wrapper for legal pages
const LegalLayout = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <div className="max-w-3xl mx-auto px-6 py-16 animate-fade-in">
    <h1 className="font-display text-4xl font-bold text-gray-900 mb-8 border-b border-brand-100 pb-4">
      {title}
    </h1>
    <div className="prose prose-pink prose-lg text-gray-600 max-w-none">
      {children}
    </div>
  </div>
);

export const TermsPage = () => (
  <LegalLayout title="Terms of Service">
    <p>Last updated: {new Date().toLocaleDateString()}</p>
    
    <h3>1. Acceptance of Terms</h3>
    <p>
      By accessing and using BabyPets.ai ("the Service"), you agree to be bound by these Terms of Service. 
      The Service is provided "as is" and intended for entertainment purposes only.
    </p>

    <h3>2. User Content and Conduct</h3>
    <p>
      You are solely responsible for the photos you upload to the Service. By uploading content, you affirm that:
    </p>
    <ul>
      <li>You own the copyright to the image or have explicit permission from the owner.</li>
      <li>The image does not violate the privacy rights or publicity rights of any third party.</li>
      <li>The content is not illegal, obscene, or harmful.</li>
    </ul>
    <p>
      We reserve the right to refuse service or remove content that violates these terms.
    </p>

    <h3>3. Intellectual Property</h3>
    <p>
      You retain ownership of your original uploaded photos. By using the Service, you grant BabyPets.ai a 
      non-exclusive, royalty-free, worldwide license to process, modify, and generate derivative works 
      (the "Baby" versions) solely for the purpose of providing the Service to you. 
      You are free to download and share the generated images for personal, non-commercial use.
    </p>

    <h3>4. AI Disclaimer</h3>
    <p>
      The Service uses advanced Artificial Intelligence (Google Gemini) to transform images. 
      We do not guarantee specific results. The generated images are artistic interpretations 
      and may not accurately reflect the actual juvenile appearance of the subject. 
      Occasional artifacts or unexpected results are inherent to AI technology.
    </p>

    <h3>5. Age Restriction</h3>
    <p>
      You must be at least 13 years old to use this Service.
    </p>

    <h3>6. Limitation of Liability</h3>
    <p>
      BabyPets.ai shall not be liable for any indirect, incidental, or consequential damages 
      arising from your use of the Service.
    </p>
  </LegalLayout>
);

export const PrivacyPage = () => (
  <LegalLayout title="Privacy Policy">
    <p>Last updated: {new Date().toLocaleDateString()}</p>
    
    <h3>1. Information We Collect</h3>
    <p>
      <strong>Uploaded Images:</strong> We collect the photos you upload solely for the purpose of 
      generating the AI transformation.
      <br/>
      <strong>Usage Data:</strong> We may collect anonymous analytics data (e.g., number of visitors) 
      to improve our Service.
    </p>

    <h3>2. How We Use Your Data</h3>
    <p>
      Your images are processed using Google's Gemini API. The images are sent securely to the AI provider 
      for the sole purpose of generation and are not used to train the model or shared with other third parties 
      for marketing purposes.
    </p>

    <h3>3. Data Retention</h3>
    <p>
      We value your privacy. Uploaded images and generated results are stored temporarily in your browser's session 
      or ephemeral cloud storage during processing. We do not maintain a permanent database of your pet photos. 
      Once you close the page or refresh, the data is typically cleared from our client-side application.
    </p>

    <h3>4. Cookies</h3>
    <p>
      We use cookies and local storage to:
    </p>
    <ul>
      <li>Track daily usage limits (to prevent abuse).</li>
      <li>Display relevant advertising (via Google AdSense).</li>
    </ul>
    <p>
      You can control cookie preferences through your browser settings.
    </p>

    <h3>5. Third-Party Services</h3>
    <p>
      We use the following third-party services:
    </p>
    <ul>
      <li><strong>Google Gemini API:</strong> For AI image generation.</li>
      <li><strong>Google AdSense:</strong> To display advertisements.</li>
    </ul>

    <h3>6. Contact Us</h3>
    <p>
      If you have questions about this Privacy Policy, please contact us via our Contact page.
    </p>
  </LegalLayout>
);

export const FAQPage = () => (
  <LegalLayout title="Frequently Asked Questions">
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-gray-900 text-xl mb-2">Is BabyPets free to use?</h3>
        <p>Yes! BabyPets is a free service supported by advertisements. You can generate a limited number of baby pet transformations per day.</p>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 text-xl mb-2">How many pets can I transform?</h3>
        <p>Currently, users are limited to 4 generations per day to ensure fair usage for everyone and manage server costs.</p>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 text-xl mb-2">What kind of photos work best?</h3>
        <p>For the best results, use a clear, well-lit photo where your pet's face is fully visible. Front-facing portraits work much better than side profiles. Avoid blurry photos or photos with multiple pets.</p>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 text-xl mb-2">Can I use the images commercially?</h3>
        <p>The images are intended for personal fun (social media, sharing with friends). We do not provide commercial licenses for the generated assets.</p>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 text-xl mb-2">Where do the photos go?</h3>
        <p>Photos are processed securely via the Google Gemini API. We do not sell your photos or store them permanently in a public gallery.</p>
      </div>
    </div>
  </LegalLayout>
);

export const ContactPage = () => (
  <LegalLayout title="Contact Us">
    <p className="lead">
      We'd love to hear from you! Whether you have a suggestion, encountered a bug, or just want to share your cute baby pet results.
    </p>

    <div className="bg-brand-50 rounded-2xl p-8 border border-brand-100 not-prose mt-8">
      <h3 className="font-display text-2xl font-bold text-gray-800 mb-4">Get in Touch</h3>
      <p className="text-gray-600 mb-6">
        For support inquiries, copyright issues, or feedback, please email us directly.
      </p>
      
      <div className="flex items-center space-x-3 text-lg font-medium text-brand-600">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
        <a href="mailto:support@babypets.ai" className="hover:underline">support@babypets.ai</a>
      </div>

      <p className="text-sm text-gray-500 mt-6">
        We typically respond within 24-48 hours.
      </p>
    </div>
  </LegalLayout>
);
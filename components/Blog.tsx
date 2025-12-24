import React from 'react';

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: React.ReactNode;
  image: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'ai-pet-transformation-science',
    title: 'The Science Behind Pet Baby Transformations: How AI Sees Your Pet',
    excerpt: 'Discover how artificial intelligence transforms your adult pet into an adorable baby version using advanced machine learning and animal development science.',
    image: 'https://i.ibb.co/jvXw4rpy/mimoette-cat.jpg',
    content: (
      <div className="space-y-6">
        <p>The field of artificial intelligence has seen exponential growth in recent years, particularly in generative image models. At BabyPets.ai, we utilize these advancements to perform what we call "conceptual age regression" on our animal companions. But how exactly does a computer "know" what a puppy looks like compared to a dog?</p>
        
        <h2 className="text-2xl font-bold text-gray-800">1. Pattern Recognition and Subject Identity</h2>
        <p>At the core of our AI transformation is subject identity preservation. The AI doesn't just generate a random puppy; it analyzes the unique "fingerprint" of your pet. This includes the exact placement of patches on their fur, the specific shade of their eye color, and the curve of their ears. By mapping these features to a juvenile skeletal and facial structure, the AI can recreate the unique essence of your pet as a baby.</p>

        <h2 className="text-2xl font-bold text-gray-800">2. Juvenile Proportions (Kindchenschema)</h2>
        <p>Science tells us that we find certain things "cute" because they follow a specific set of physical features identified by ethologist Konrad Lorenz as "Kindchenschema" (baby schema). These include a large head relative to the body, large eyes positioned low on the face, and soft, rounded features. Our AI intelligently applies these biological rules to your pet's adult form.</p>

        <h2 className="text-2xl font-bold text-gray-800">3. Texture Analysis and Fur Synthesis</h2>
        <p>A puppy's coat is fundamentally different from an adult dog's. It's often finer, softer, and more translucent. The AI performs texture synthesis to replace the coarse adult fur with the downy "puppy fuzz" typical of early development stages, all while keeping the original color distribution intact.</p>

        <p>The result is a hyper-realistic glimpse into the past that feels emotionally resonant because it captures the true character of your pet.</p>
      </div>
    )
  },
  {
    slug: 'perfect-pet-photo-tips',
    title: '10 Tips for Taking the Perfect Pet Photo for AI Transformation',
    excerpt: 'Learn professional pet photography techniques to capture photos that transform beautifully into baby versions with BabyPets.ai.',
    image: 'https://i.ibb.co/Fq85Ccwt/addie-dog.jpg',
    content: (
      <div className="space-y-6">
        <p>To get the most out of BabyPets.ai, starting with a high-quality photo is essential. While our AI is powerful, a clear input allows for much more accurate identity mapping. Here are our top tips for capturing that perfect shot.</p>

        <h2 className="text-2xl font-bold text-gray-800">1. Natural Light is King</h2>
        <p>Avoid using the flash. Harsh flash can create "red-eye" or wash out the subtle patterns in your pet's fur. Instead, try to take photos near a large window or outdoors on a slightly overcast day for soft, even lighting.</p>

        <h2 className="text-2xl font-bold text-gray-800">2. Get Down on Their Level</h2>
        <p>Photos taken from a human's height looking down can distort proportions. Crouching down to your pet's eye level creates a much more intimate and engaging portrait that the AI can process more effectively.</p>

        <h2 className="text-2xl font-bold text-gray-800">3. Focus on the Eyes</h2>
        <p>The eyes are the windows to your pet's soul—and the most important feature for our identity mapping. Ensure the focus is sharp right on the eyes.</p>

        <h2 className="text-2xl font-bold text-gray-800">4. Keep it Simple</h2>
        <p>A cluttered background can sometimes confuse AI models. Try to photograph your pet against a relatively simple, non-distracting background like a plain wall, grass, or a neutral-colored floor.</p>

        <h2 className="text-2xl font-bold text-gray-800">5. Use Treats for Attention</h2>
        <p>Struggling to get them to look at the camera? Hold a favorite treat or a squeaky toy right above the lens. This creates that alert, bright-eyed expression that looks so good in a baby transformation.</p>
      </div>
    )
  },
  {
    slug: 'science-of-cuteness',
    title: 'Why We Love Baby Animals: The Science of Cuteness',
    excerpt: 'Explore the fascinating neuroscience and evolutionary biology behind why baby animals trigger such powerful emotional responses in humans.',
    image: 'https://i.ibb.co/qMkskHsB/mochi-cat.jpg',
    content: (
      <div className="space-y-6">
        <p>Why do we stop in our tracks when we see a puppy? Why does a kitten's tiny "mew" make us melt? It turns out, our reaction to cuteness is hardwired into our brains through millions of years of evolution.</p>

        <h2 className="text-2xl font-bold text-gray-800">The Nurturing Instinct</h2>
        <p>Evolutionary biology suggests that humans have evolved to be hyper-sensitive to features associated with human infants. This ensures that parents will feel a strong urge to protect and care for their offspring. Curiously, this instinct isn't limited to our own species. Because baby animals share many of these same "cute" traits—large heads, big eyes, and clumsy movements—they hijack our caregiving circuits.</p>

        <h2 className="text-2xl font-bold text-gray-800">The Dopamine Hit</h2>
        <p>When we see something cute, our brain's reward system kicks in. The nucleus accumbens, a key part of the brain's reward circuitry, releases dopamine—the same chemical released when we eat chocolate or fall in love. This instant "feel-good" hit explains why scrolling through baby animal photos is so addictive.</p>

        <h2 className="text-2xl font-bold text-gray-800">Emotional Benefits</h2>
        <p>Studies have shown that looking at baby animal photos can actually improve focus and performance on tasks requiring care and precision. It also reduces cortisol levels, our primary stress hormone. In a very real sense, seeing your pet as a baby is good for your mental health!</p>
      </div>
    )
  },
  {
    slug: 'dog-life-stages',
    title: 'From Puppies to Seniors: Understanding Your Dog\'s Life Stages',
    excerpt: 'A comprehensive guide to every stage of your dog\'s development from newborn puppy to senior companion.',
    image: 'https://i.ibb.co/vCGbQM4B/echo-dog.jpg',
    content: (
      <div className="space-y-6">
        <p>Every pet owner knows that time flies far too fast. One day you're bringing home a tiny bundle of fur, and the next, they're a dignified adult. Understanding the different life stages of your dog can help you provide the best care at every age.</p>

        <h2 className="text-2xl font-bold text-gray-800">The Puppy Stage (0-12 months)</h2>
        <p>This is the most critical developmental period. It's when socialization happens and the foundations of behavior are laid. This is the stage that BabyPets.ai aims to recreate, capturing that fleeting window of growth when everything is new and exciting.</p>

        <h2 className="text-2xl font-bold text-gray-800">Adolescence (1-2 years)</h2>
        <p>Just like human teenagers, dogs in this stage can be a bit rebellious! They are testing boundaries and have high energy levels. It's a time of physical maturation where they finally grow into those big puppy paws.</p>

        <h2 className="text-2xl font-bold text-gray-800">Adulthood (2-7 years)</h2>
        <p>In their prime, adult dogs are usually settled into their personalities and routines. This is often the longest stage of their life, where the bond between owner and pet is at its strongest and most stable.</p>

        <h2 className="text-2xl font-bold text-gray-800">Senior Years (7+ years)</h2>
        <p>As dogs age, they might slow down, but their loyalty only deepens. Seeing a senior dog transformed back into their puppy self is one of the most emotional uses of our AI technology for many of our users.</p>
      </div>
    )
  },
  {
    slug: 'sharing-pet-photos-social-media',
    title: 'The Ultimate Guide to Sharing Your Pet Photos on Social Media',
    excerpt: 'Maximize engagement with your baby pet transformations using these proven social media strategies for pet content.',
    image: 'https://i.ibb.co/7NyRgNBk/peanut-cat.jpg',
    content: (
      <div className="space-y-6">
        <p>Pet content is the lifeblood of the internet. From viral TikToks to popular Instagram accounts, animals dominate our feeds. If you've just created a stunning baby transformation on BabyPets.ai, here's how to share it effectively.</p>

        <h2 className="text-2xl font-bold text-gray-800">1. The "Before and After" Slide</h2>
        <p>People love a transformation. On platforms like Instagram, use the carousel feature to show the original photo first, followed by the AI baby version. It creates a satisfying reveal that encourages people to swipe and engage.</p>

        <h2 className="text-2xl font-bold text-gray-800">2. Use Trending Pet Hashtags</h2>
        <p>Reach a wider audience by using relevant hashtags. Some popular ones include #PetTransformation, #PuppyLove, #AIPet, and #DogsofInstagram. Don't forget to tag @BabyPetsAI if you want a chance to be featured!</p>

        <h2 className="text-2xl font-bold text-gray-800">3. Write a Heartfelt Caption</h2>
        <p>Tell a story. Was this what you imagined they looked like? If they're a rescue, does this glimpse into their past touch your heart? Personal stories always get more engagement than generic captions.</p>

        <h2 className="text-2xl font-bold text-gray-800">4. Leverage Reels and TikTok</h2>
        <p>Use our comparison image download and pair it with a popular audio track about time passing or pet growth. These "glow-down" (or "baby-up") videos are incredibly popular and highly shareable.</p>
      </div>
    )
  }
];

export const BlogPage = ({ onNavigate }: { onNavigate: (view: any, slug?: string) => void }) => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 animate-fade-in">
      <h1 className="font-display text-4xl md:text-5xl font-black text-gray-900 mb-12 border-b border-brand-100 pb-6">
        The BabyPets Blog
      </h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        {BLOG_POSTS.map((post) => (
          <article 
            key={post.slug} 
            className="flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
            onClick={() => onNavigate('blog-post', post.slug)}
          >
            <div className="aspect-video overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8 space-y-4">
              <h2 className="font-display text-2xl font-bold text-gray-800 group-hover:text-brand-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-600 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
              <button className="text-brand-600 font-bold flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                Read More <span>→</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export const BlogPostPage = ({ slug }: { slug: string }) => {
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <p>Sorry, the blog post you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 animate-fade-in">
      <header className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">
          {post.title}
        </h1>
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full aspect-video object-cover rounded-[2.5rem] shadow-lg mb-8"
        />
      </header>
      
      <div className="prose prose-pink prose-lg max-w-none text-gray-600 leading-relaxed">
        {post.content}
      </div>

      <div className="mt-16 pt-8 border-t border-brand-100">
        <h3 className="font-display text-xl font-bold mb-4">Share this article</h3>
        <div className="flex gap-4">
           {/* Placeholder for social sharing buttons */}
           <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-brand-50 transition-colors cursor-pointer">FB</div>
           <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-brand-50 transition-colors cursor-pointer">TW</div>
           <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-brand-50 transition-colors cursor-pointer">LI</div>
        </div>
      </div>
    </div>
  );
};
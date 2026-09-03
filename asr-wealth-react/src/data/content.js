/* ── ASR Wealth Content Data — From DOCX Documents ── */

export const brandData = {
  name: 'ASR Wealth',
  tagline: 'Aspire. Secure. Rise.',
  fullTagline: 'A — Aspire | S — Secure | R — Rise',
  essence: 'Where Wealth Finds Purpose.',
  description:
    'A boutique investment firm built on relationships, driven by expertise, and inspired by the future.',
  philosophy:
    'At ASR Wealth, we believe wealth is not merely about accumulating money — it is about creating freedom, protecting what matters, and building a legacy that rises across generations.',
};

export const visionMission = {
  vision:
    'To be the trusted wealth partner for individuals and families who aspire to create, secure, and grow lasting wealth — enabling them to rise with confidence across generations.',
  visionExtended:
    'We envision a future where every client has the clarity, confidence, and strategy to make their wealth work meaningfully toward their ambitions, lifestyle, and legacy.',
  mission:
    'To deliver personalised, disciplined, and long-term wealth solutions that help our clients Aspire for greater possibilities, Secure the wealth they have created, and Rise toward financial independence and generational prosperity.',
  missionExtended:
    'As a boutique investment firm, ASR Wealth combines personal attention, thoughtful investment strategies, and a deep understanding of each client\'s goals to create enduring wealth outcomes.',
};

export const promiseData = [
  {
    id: 'aspire',
    title: 'ASPIRE',
    subtitle: 'Dream Bigger',
    description: 'Dream bigger. Plan with purpose. Invest for possibilities.',
    icon: 'rocket',
    color: '93, 92, 231', /* Electric Indigo */
  },
  {
    id: 'secure',
    title: 'SECURE',
    subtitle: 'Protect & Preserve',
    description:
      'Protect what you have built. Manage risk. Preserve wealth across generations.',
    icon: 'shield',
    color: '33, 37, 41', /* Deep Onyx */
  },
  {
    id: 'rise',
    title: 'RISE',
    subtitle: 'Grow & Legacy',
    description:
      'Grow with discipline. Create financial freedom. Build a lasting legacy.',
    icon: 'trending-up',
    color: '255, 184, 0', /* Vivid Spark Amber/Yellow */
  },
];

export const clientTypes = [
  {
    id: 'hni',
    title: 'HNI & UHNI Families',
    shortDesc: 'Bespoke wealth & legacy preservation.',
    description:
      'Sophisticated wealth management, tailored estate structuring, asset protection, and generational legacy planning designed for substantial family estates.',
    icon: 'business',
    ctaText: 'Learn More',
    link: '#offerings',
  },
  {
    id: 'professionals',
    title: 'Young Professionals',
    shortDesc: 'Disciplined capital accumulation.',
    description:
      'Building a strong financial foundation, systematic investment discipline, and accelerating long-term wealth creation for ambitious modern professionals.',
    icon: 'briefcase',
    ctaText: 'Learn More',
    link: '#offerings',
  },
  {
    id: 'multi-gen',
    title: 'Multi-Generational Families',
    shortDesc: 'Intergenerational wealth alignment.',
    description:
      'Aligning family wealth, succession architecture, business transition governance, and enduring intergenerational financial goals across decades.',
    icon: 'people',
    ctaText: 'Learn More',
    link: '#offerings',
  },
];

export const leadershipData = [
  {
    id: 'rishi',
    name: 'Rishi Bhansali',
    role: 'Mentor | Entrepreneur | Business Strategist',
    archetype: 'The Wisdom',
    photo: null,
    initials: 'RB',
    bio: 'Rishi Bhansali is an accomplished entrepreneur, mentor, and MBA with extensive experience of building and managing successful businesses across diverse industries. Over the years, Rishi has successfully created and operated businesses across Real Estate, Restaurants, and Manufacturing, giving him a broad and practical understanding of entrepreneurship, business strategy, operations, growth, and financial decision-making.',
    extended:
      'His entrepreneurial journey has given him an instinctive understanding of business, people, markets, and relationships. One of his greatest strengths is his ability to build and nurture meaningful relationships based on trust and credibility. As a mentor to ASR Wealth, Rishi brings the wisdom of experience and the perspective of a seasoned entrepreneur.',
    philosophy:
      '"Lasting success is built not only through numbers, but through people, relationships, and the ability to think beyond the immediate."',
    attributes: [
      'Experience',
      'Wisdom',
      'Relationships',
      'Entrepreneurial Perspective',
    ],
    color: '93, 92, 231', /* Electric Indigo */
  },
  {
    id: 'shreyance',
    name: 'Shreyance Sancheti',
    role: 'Founder & CEO | MBA | Wealth & Investment Professional',
    archetype: 'The Expertise',
    photo: null,
    initials: 'SS',
    bio: 'Shreyance Sancheti is the Founder & CEO of ASR Wealth, bringing over 15 years of professional experience in Treasury, Investment Banking, Debt Markets, and Capital Markets. Prior to founding ASR Wealth, Shreyance built his career with leading financial institutions including L&T Finance and Deutsche Bank.',
    extended:
      'With rich experience in creating, structuring, and managing large investment portfolios, Shreyance brings a deep understanding of market cycles, asset allocation, portfolio construction, and investment risk. At the core of his approach is a strong client-first philosophy — wealth management should begin with understanding the client, not the product.',
    philosophy:
      '"Wealth management is not about finding a product for a client; it is about understanding the client and creating the right solution around their goals."',
    attributes: [
      'Investment Expertise',
      'Market Knowledge',
      'Portfolio Discipline',
      'Client-Centric Thinking',
    ],
    color: '33, 37, 41', /* Deep Onyx */
  },
  {
    id: 'arnav',
    name: 'Arnav Bhansali',
    role: 'Co-Founder & Managing Director | MBA, SP Jain | Entrepreneur',
    archetype: 'The Future',
    photo: null,
    initials: 'AB',
    bio: 'Arnav Bhansali is the Co-Founder and Managing Director of ASR Wealth, representing the energy, ambition, and entrepreneurial spirit of the next generation. An MBA graduate from SP Jain Institute of Management & Research, Arnav brings a contemporary business perspective, strong entrepreneurial drive, and an appetite for innovation and growth.',
    extended:
      'Arnav is focused on business development, growth, client engagement, strategic initiatives, and building relationships with the next generation of investors and entrepreneurs. He believes the future of wealth management will be shaped by the intersection of trust, technology, innovation, and personalised experiences.',
    philosophy:
      '"Youth brings the courage to challenge the conventional, the energy to pursue the extraordinary, and the passion to build something that lasts."',
    attributes: [
      'Youthful Energy',
      'Innovation',
      'Ambition',
      'Growth Mindset',
    ],
    color: '255, 184, 0', /* Vivid Amber / Spark */
  },
];

export const offeringsData = [
  {
    id: 'mutual-funds',
    title: 'Mutual Funds',
    category: 'Mutual Funds',
    description:
      'Mutual funds pool money from investors and invest in a portfolio of securities such as equities, bonds, or a mix of both. Managed by Asset Management Companies and regulated by SEBI.',
    features: [
      'Professional Management by experienced fund managers',
      'Diversification to reduce risk across securities',
      'High Liquidity with easy redemption',
      'SIPs starting from ₹100–500',
    ],
    subtypes: ['Equity Funds', 'Debt Funds', 'Hybrid Funds', 'Index Funds/ETFs'],
    color: '93, 92, 231', /* Electric Indigo */
  },
  {
    id: 'equities',
    title: 'Equities',
    category: 'Equities',
    description:
      'Access a full-featured platform to buy, sell, and manage securities online. Lower transaction costs with real-time market research and updates.',
    features: [
      'Online Trading & Access — anytime, anywhere',
      'IPO, FPO & Rights Issue Applications via ASBA',
      'Electronic Holding of Securities in Demat',
      'Automatic Corporate Action Benefits',
    ],
    subtypes: [],
    color: '42, 123, 127', /* Teal */
  },
  {
    id: 'ncd-mld',
    title: 'NCD / MLD',
    category: 'NCD/MLD',
    description:
      'Non-Convertible Debentures offer fixed-income with regular interest payouts. Market Linked Debentures provide returns linked to market indices for enhanced growth potential.',
    features: [
      'Stable income from NCD interest payouts',
      'Capital appreciation via market-linked returns',
      'Available in secured and unsecured variants',
      'Listed on recognised stock exchanges',
    ],
    subtypes: ['Non-Convertible Debentures', 'Market Linked Debentures'],
    color: '27, 107, 77', /* Emerald */
  },
  {
    id: 'pms',
    title: 'Portfolio Management Services',
    category: 'PMS',
    description:
      'PMS manages an ideal combination of securities to generate optimum returns through proper diversification. Unlike Mutual Funds, ownership of securities lies directly with the investor.',
    features: [
      'Professionally managed, tailor-made portfolios',
      'Research-oriented with early access to great companies',
      'Full transparency — securities held in your name',
      'Tax efficient with easy tracking & monitoring',
    ],
    subtypes: [],
    minimumInvestment: '₹50 Lakhs',
    color: '67, 65, 205', /* Deep Primary Indigo */
  },
  {
    id: 'aif',
    title: 'Alternative Investment Funds',
    category: 'AIF',
    description:
      'AIFs are privately pooled vehicles regulated by SEBI, offering access to non-traditional assets such as private equity, venture capital, real estate, and hedge funds.',
    features: [
      'Category I — Start-ups, SMEs, Infrastructure',
      'Category II — Private Equity & Debt Funds',
      'Category III — Hedge Funds & Complex Strategies',
      'Minimum investment of ₹1 Crore',
    ],
    subtypes: ['Category I', 'Category II', 'Category III'],
    minimumInvestment: '₹1 Crore',
    color: '139, 92, 246', /* Violet */
  },
];

export const offeringCategories = [
  'All',
  'Mutual Funds',
  'Equities',
  'NCD/MLD',
  'PMS',
  'AIF',
];

export const whyChooseUsData = [
  {
    title: 'Personalised Strategy',
    description: 'Every client. Every goal. One bespoke plan tailored to your aspirations, risk appetite, and long-term financial journey.',
    icon: 'compass',
  },
  {
    title: 'Institutional Expertise',
    description: '15+ years of experience across Treasury, Capital Markets, Investment Banking, and Debt Markets with leading financial institutions.',
    icon: 'analytics',
  },
  {
    title: 'Long-Term Partnership',
    description: 'We think in decades, not quarters. Our approach is built on trust, discipline, and a deep commitment to your generational prosperity.',
    icon: 'handshake',
  },
  {
    title: 'Next-Gen Innovation',
    description: 'A modern, forward-looking platform combining trust with technology, innovation with relationships, and ambition with expertise.',
    icon: 'flash',
  },
];

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Offerings', href: '#offerings' },
  { label: 'Leadership', href: '#leadership' },
  { label: 'Contact', href: '#contact' },
];

export const footerLinks = {
  quickLinks: [
    { label: 'About Us', href: '#about' },
    { label: 'Our Offerings', href: '#offerings' },
    { label: 'Leadership Team', href: '#leadership' },
    { label: 'Contact Us', href: '#contact' },
    { label: 'Investor Zone', href: 'https://credible.live/mf-forms/' },
  ],
  offerings: [
    { label: 'Mutual Funds', href: '#offerings' },
    { label: 'Equities', href: '#offerings' },
    { label: 'NCD / MLD', href: '#offerings' },
    { label: 'PMS', href: '#offerings' },
    { label: 'AIF', href: '#offerings' },
  ],
  legal: [
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Disclaimer', href: '#' },
  ],
};

export const socialLinks = [
  { platform: 'LinkedIn', url: '#', icon: 'logo-linkedin' },
  { platform: 'Twitter', url: '#', icon: 'logo-twitter' },
  { platform: 'Instagram', url: '#', icon: 'logo-instagram' },
  { platform: 'YouTube', url: '#', icon: 'logo-youtube' },
];

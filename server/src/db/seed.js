import 'dotenv/config';
import pool from './index.js';

async function seed() {
  const client = await pool.connect();
  try {
    // Admin user
    const email = process.env.ADMIN_EMAIL;
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    if (!passwordHash) {
      throw new Error('Set ADMIN_PASSWORD_HASH in .env (run: node src/db/hashpw.js <password>)');
    }
    await client.query(
      `INSERT INTO admins (email, password_hash) VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET password_hash = $2`,
      [email, passwordHash]
    );

    // Services
    const services = [
      {
        title: 'GoHighLevel Custom Setup & Integrations',
        description: 'We build GoHighLevel setups that go far beyond the basics — full CRM buildouts, multi-step funnel sequences, membership portals, and advanced webhook automations across multiple systems. Most GHL consultants configure what\'s already there. We extend the platform with custom logic it wasn\'t built to handle natively.',
        icon: 'crm',
        sort_order: 1,
      },
      {
        title: 'Custom API & Payment Gateway Integration',
        description: 'GoHighLevel doesn\'t natively connect to every payment gateway, database, or legacy system your business runs on. We build the bridge — PayMongo, GCash, Maya, Stripe, and virtually any service with an API. Every integration includes error handling, retry logic, and data validation so nothing breaks silently at 2am.',
        icon: 'api',
        sort_order: 2,
      },
      {
        title: 'Workflow Automation Consulting',
        description: 'We start by mapping your current workflow and finding where manual work is eating your team\'s time. We use the right tool for each job — n8n for complex conditional logic, Make.com or Zapier for rapid deployment, and custom code where no-code falls short. You get a documented automation stack you understand and can maintain.',
        icon: 'workflow',
        sort_order: 3,
      },
      {
        title: 'QA & Integration Testing',
        description: 'Automations that aren\'t tested will eventually break at the worst possible time — during a payment, a client onboarding, or a live campaign. With 5+ years as a software test engineer in regulated energy-sector systems, we bring enterprise-grade QA to every integration: test plans, edge case coverage, JIRA-tracked issue resolution, and load testing.',
        icon: 'qa',
        sort_order: 4,
      },
      {
        title: 'Software Development',
        description: 'When no-code platforms hit their ceiling, we build the custom solution — dashboards, APIs, data pipelines, and web applications. Full-stack capability across Node.js, Python, React, and more, backed by 15+ years of professional software engineering.',
        icon: 'code',
        sort_order: 5,
      },
    ];

    for (const s of services) {
      await client.query(
        `INSERT INTO services (title, description, icon, sort_order)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [s.title, s.description, s.icon, s.sort_order]
      );
    }

    // Projects
    const projects = [
      {
        title: 'PayMongo + GoHighLevel',
        slug: 'paymongo-ghl',
        description: 'Agencies processing GCash and Maya payments had to manually match payment notifications to client records, generate invoices, and trigger onboarding sequences — 15–20 minutes of staff time per transaction. Built a Node.js webhook bridge deployed on Railway that intercepts PayMongo payment events, creates or updates GHL contacts, generates invoices, and triggers SMS + email automation sequences — all in under 3 seconds.',
        tags: ['GoHighLevel', 'Node.js', 'PayMongo', 'Railway', 'Docker'],
        results: '15h+ saved per week · ₱0 reconciliation errors · <3s end-to-end trigger',
        sort_order: 1,
      },
      {
        title: 'SmashMatch Court Queue Manager',
        slug: 'smashMatch-court-queue',
        description: 'Staff at a busy badminton facility were managing court queues with pen and paper — double-bookings, disputes, and significant manual coordination during peak hours. Built a real-time React web app with a live court status board, digital queue management, and walk-in registration. Staff manage everything from a single dashboard, no app install required for customers.',
        tags: ['React', 'Node.js', 'WebSockets', 'Real-time'],
        results: '60% staff workload reduction · 0 double-bookings since launch',
        sort_order: 2,
      },
      {
        title: 'SnowPros Business Website',
        slug: 'snowpros-website',
        description: 'Designed and built a complete business website for a Canadian snow removal service. Custom WordPress theme with service area pages, a quote request form connected to email, and a mobile-first layout built for local SEO.',
        tags: ['WordPress', 'PHP', 'Fluent Forms', 'Local SEO'],
        results: 'Full local SEO optimisation · Mobile-first · Quote form automation',
        sort_order: 3,
      },
      {
        title: 'Playwithbella Shopify Store',
        slug: 'playwithbella-shopify',
        description: 'Built a conversion-optimised Shopify storefront for a children\'s toy brand with custom product page layouts, a sticky add-to-cart bar, and collection filtering. Focused on reducing friction between browse and checkout for a mobile-first customer base.',
        tags: ['Shopify', 'Liquid', 'Conversion Optimisation'],
        results: 'Reduced browse-to-checkout friction · Mobile-first UX · Custom product layouts',
        sort_order: 4,
      },
    ];

    for (const p of projects) {
      await client.query(
        `INSERT INTO projects (title, slug, description, tags, results, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (slug) DO NOTHING`,
        [p.title, p.slug, p.description, p.tags, p.results, p.sort_order]
      );
    }

    // Experience
    const experience = [
      {
        role: 'Freelance Software Engineer & Automation Specialist',
        company: 'AutomationHub.ph',
        period: '2023 – Present',
        bullets: [
          'GoHighLevel CRM buildouts, custom integrations, and advanced webhook automations',
          'Custom API and payment gateway integrations (PayMongo, GCash, Maya, Stripe)',
          'Workflow automation using n8n, Make.com, Zapier, and custom Node.js/Python',
          'GHL Certified Specialist · 100% job success rate on Upwork',
        ],
        sort_order: 1,
      },
      {
        role: 'Software Engineer',
        company: 'Financial Services',
        period: '2023 – Present',
        bullets: [
          'Full-stack development across React, Node.js, and cloud infrastructure',
          'ISO 20001/9001 compliant development practices',
        ],
        sort_order: 2,
      },
      {
        role: 'Software Design Specialist',
        company: 'Energy Market Sector',
        period: '2018 – 2023',
        bullets: [
          'Designed and maintained software systems for Philippine electricity market infrastructure',
          'Worked within regulated, high-availability enterprise environments',
        ],
        sort_order: 3,
      },
      {
        role: 'Software Test Engineer',
        company: 'Energy Market Sector',
        period: '2013 – 2018',
        bullets: [
          '5 years dedicated QA engineering in regulated energy-sector systems',
          'Test plans, edge case coverage, JIRA-tracked issue resolution, and load testing',
        ],
        sort_order: 4,
      },
      {
        role: '.NET Developer',
        company: 'Energy Sector',
        period: '2011 – 2013',
        bullets: [
          'Enterprise .NET development in the energy sector',
        ],
        sort_order: 5,
      },
    ];

    for (const e of experience) {
      await client.query(
        `INSERT INTO experience (role, company, period, bullets, sort_order)
         VALUES ($1, $2, $3, $4, $5)`,
        [e.role, e.company, e.period, e.bullets, e.sort_order]
      );
    }

    // Testimonials
    await client.query(
      `INSERT INTO testimonials (client_name, client_title, body, rating)
       VALUES ($1, $2, $3, $4)`,
      [
        'Upwork Client',
        'Google Sheets Automation · Verified Review',
        'I was very happy with the communication and the responsiveness. Thanks',
        5,
      ]
    );

    // Certifications
    const certifications = [
      { title: 'GoHighLevel Certified Specialist', provider: 'GoHighLevel', issued_date: null, sort_order: 1 },
      { title: 'Claude 101', provider: 'Anthropic', issued_date: 'Apr 2026', sort_order: 2 },
      { title: 'Introduction to Claude Cowork', provider: 'Anthropic', issued_date: 'Apr 2026', sort_order: 3 },
      { title: 'Claude Code in Action', provider: 'Anthropic', issued_date: 'Apr 2026', sort_order: 4 },
      { title: 'Claude Code 101', provider: 'Anthropic', issued_date: 'Apr 2026', sort_order: 5 },
      { title: 'Agile with Atlassian Jira', provider: 'Atlassian', issued_date: null, sort_order: 6 },
      { title: 'Python Programming', provider: 'Google', issued_date: null, sort_order: 7 },
      { title: 'Git & GitHub', provider: 'Google', issued_date: null, sort_order: 8 },
      { title: 'AI Prototyping (Google AI Studio)', provider: 'Google', issued_date: null, sort_order: 9 },
      { title: 'ISO 20001 & 9001 Compliant Development', provider: 'ISO', issued_date: null, sort_order: 10 },
    ];

    for (const c of certifications) {
      await client.query(
        `INSERT INTO certifications (title, provider, issued_date, sort_order)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [c.title, c.provider, c.issued_date, c.sort_order]
      );
    }

    console.log('Seed complete.');
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

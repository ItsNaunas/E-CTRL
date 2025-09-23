# e-ctrl - Free Amazon Growth Audit Tool

A minimalist, fast website centered on a **free Amazon growth audit tool** for UK/EU sellers. Built with Next.js, TypeScript, and Tailwind CSS following world-class minimalist web design principles.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Project Overview

**e-ctrl** is designed for Amazon sellers in the UK and EU, offering:

- **Existing Sellers**: ASIN-based listing audits with actionable insights
- **New Sellers**: Product readiness assessments with launch guidance
- **Free Tool**: One audit per email per day, with instant summaries and detailed email reports

### Core Features

- ✅ **Dual-path forms** for existing and new Amazon sellers
- ✅ **Real-time validation** with Zod schemas
- ✅ **Mock audit results** with deterministic scoring
- ✅ **Responsive design** following 8pt grid system
- ✅ **Accessibility-first** with WCAG compliance
- ✅ **Performance optimized** with <2s load times

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with design tokens
- **Validation**: Zod for form schemas
- **Icons**: Lucide React
- **Deployment**: Ready for Vercel

### File Structure

```
/app
  layout.tsx          # Root layout with metadata
  globals.css         # Tailwind base styles
  page.tsx           # Home page
  /tool/page.tsx     # Main audit tool
  /about/page.tsx    # About page
  /legal/
    privacy/page.tsx # Privacy policy
    terms/page.tsx   # Terms of service

/components
  Header.tsx         # Navigation header
  Footer.tsx         # Site footer
  Container.tsx      # Max-width container
  Section.tsx        # Section spacing
  Card.tsx          # Content cards
  Button.tsx        # CTA buttons
  Input.tsx         # Form inputs
  Select.tsx        # Dropdowns
  Tabs.tsx          # Tab switcher
  ChipsInput.tsx    # Keyword chips
  FileDropzone.tsx  # Image upload
  SummaryCard.tsx   # Results display
  FormField.tsx     # Form wrapper

/lib
  copy.ts           # Centralized content
  validation.ts     # Zod schemas
  mock.ts          # Mock generators

/public
  favicon.ico       # Site icons (placeholder)
  og-image.png      # Social sharing (placeholder)
```

## 🎨 Design System

Following the **MINIMAL_WEB_DESIGN_OS** principles:

### Typography
- **Font**: Inter (Google Fonts)
- **Scale**: H1 ≈ 2× body size (32-40px)
- **Line height**: 1.5 for readability

### Colors
- **Background**: #ffffff (light), #020617 (dark mode ready)
- **Text**: #0F172A (slate-900)
- **Accent**: #2563EB (blue-600)
- **Muted**: #F8FAFC (slate-50)

### Spacing
- **Grid**: 8pt system (8, 16, 24, 32, 40, 48px)
- **Sections**: py-16 desktop, py-8 mobile
- **Cards**: p-6 default padding

### Components
- **Buttons**: ≥44px tap targets, subtle hover states
- **Forms**: Clear labels, validation states, help text
- **Focus**: 2px accent ring, visible for accessibility

## 📝 Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start           # Start production build

# Code Quality
npm run lint        # ESLint check
npm run format      # Prettier formatting
npm run typecheck   # TypeScript validation

# All quality checks
npm run lint && npm run typecheck && npm run format
```

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.env.local` and configure:

```env
# Future integrations (not needed for static version)
SUPABASE_URL=your-supabase-url
RESEND_API_KEY=your-resend-key
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain
```

### Tailwind Tokens

Design tokens are defined in `tailwind.config.js`:

```js
colors: {
  background: '#ffffff',
  foreground: '#0F172A',
  accent: '#2563EB',
  muted: '#F8FAFC',
  // Dark mode ready...
}
```

## 🧪 Form Validation

### Existing Seller Schema
```typescript
{
  asin: string (ASIN or Amazon URL),
  keywords?: string[] (max 8),
  fulfilment?: 'FBA' | 'FBM',
  name: string (min 2 chars),
  email: string (valid email),
  phone?: string
}
```

### New Seller Schema
```typescript
{
  websiteUrl?: string (valid URL),
  noWebsiteDesc?: string (if no website),
  category: string (from predefined list),
  desc: string (12-400 chars),
  keywords: string[] (2-5 required),
  fulfilmentIntent: 'FBA' | 'FBM' | 'Unsure',
  image: File (JPG/PNG, max 8MB),
  name: string,
  email: string,
  phone?: string
}
```

## 🎯 Mock Results

The tool generates deterministic mock results based on input:

### Existing Sellers
- **Score**: 65-89 (based on ASIN hash)
- **Insights**: Title keywords, image compliance, bullet points
- **Suggestions**: 3 actionable recommendations

### New Sellers
- **Score**: 60-89 (based on category + description)
- **Category advice**: Competition level, compliance notes
- **Readiness tips**: 3 launch preparation steps

## 🚦 Phase Roadmap

### ✅ Phase A - Static MVP (Current)
- [x] Complete form validation with Zod
- [x] Mock result generation
- [x] Responsive design implementation
- [x] Accessibility compliance
- [x] SEO optimization

### 🔄 Phase B - Backend Integration (Next)
- [ ] Supabase database setup
- [ ] API routes (`/api/report`, `/api/email`)
- [ ] Resend email templates
- [ ] Rate limiting implementation
- [ ] Image processing pipeline

### 🔮 Phase C - Advanced Features (Future)
- [ ] Advanced listing optimization recommendations
- [ ] Advanced analytics with Plausible
- [ ] Bot protection with Turnstile
- [ ] A/B testing framework
- [ ] Performance monitoring

## 🔍 TODO Markers

Search for `TODO:` comments throughout the codebase for integration points:

```bash
# Find all TODOs
grep -r "TODO:" --include="*.ts" --include="*.tsx" .
```

Key integration points:
- **Database**: Connect Supabase for lead storage
- **Email**: Integrate Resend for report delivery
- **Images**: Add processing for Amazon variants
- **Analytics**: Implement Plausible tracking
- **Security**: Add Turnstile bot protection

## 🎨 Minimalist Design Rationale

### Why This Design Works

1. **Single Focus**: Each page has one primary action, reducing cognitive load
2. **Generous Spacing**: 8pt grid creates rhythm and improves scannability  
3. **Limited Palette**: Neutral base + single accent focuses attention on forms
4. **Clear Hierarchy**: Typography scale guides users through content
5. **Accessible Forms**: Labels, help text, and validation support all users
6. **Performance First**: No external scripts in MVP, optimized for speed

### Accessibility Features

- **Semantic HTML**: Proper headings, labels, landmarks
- **Keyboard Navigation**: All interactive elements focusable
- **Screen Readers**: ARIA labels, descriptions, invalid states
- **Motion**: Respects `prefers-reduced-motion`
- **Contrast**: WCAG 4.5:1 minimum for all text
- **Touch Targets**: ≥44px for mobile usability

## 📊 Performance Targets

- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **First Input Delay**: <100ms
- **Lighthouse Scores**: 90+ across all metrics

## 🔒 Security & Privacy

- **GDPR Compliant**: Privacy policy with clear data usage
- **Data Minimization**: Only collect necessary information
- **Secure Forms**: Client-side validation + server validation
- **Rate Limiting**: 1 report per email per day
- **File Validation**: Image type, size, and content checks

## 🤝 Contributing

1. Follow the established file structure
2. Use TypeScript strict mode
3. Maintain design token consistency
4. Add TODO comments for future integrations
5. Test accessibility with keyboard navigation
6. Ensure mobile responsiveness

## 📧 Contact

For integration assistance or questions:
- **Email**: hello@e-ctrl.example
- **Technical**: dev@e-ctrl.example

---

**Next Steps**: Ready for Supabase schema, API routes, and email template integration. Contact for the complete backend implementation guide.
#   L a s t   u p d a t e d :   0 8 / 2 9 / 2 0 2 5   1 8 : 2 7 : 4 5 
 
 #   F o r c e   d e p l o y m e n t   -   0 8 / 2 9 / 2 0 2 5   1 8 : 5 4 : 3 1 
 
 #   T r i g g e r   n e w   d e p l o y m e n t 
 
 
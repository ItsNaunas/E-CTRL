# E-CTRL Testing Guide

This document provides a comprehensive guide to the automated testing setup for the E-CTRL Amazon audit tool.

## 🧪 Testing Overview

Our testing strategy follows the testing pyramid approach:

- **70% Unit Tests** - Fast, isolated tests for individual functions
- **20% Integration Tests** - API endpoint and component interaction tests  
- **10% E2E Tests** - Full user journey tests

## 📁 Test Structure

```
tests/
├── unit/                 # Unit tests for individual functions
│   ├── validation.test.ts
│   └── utils.test.ts
├── integration/          # API and component integration tests
│   └── api.test.ts
└── e2e/                  # End-to-end user flow tests
    ├── existing-seller.spec.ts
    ├── new-seller.spec.ts
    ├── guest-access.spec.ts
    └── homepage.spec.ts
```

## 🚀 Running Tests

### Unit & Integration Tests
```bash
# Run all unit and integration tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### End-to-End Tests
```bash
# Run E2E tests (headless)
npm run test:e2e

# Run E2E tests with UI (interactive mode)
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed
```

### All Tests
```bash
# Run both unit and E2E tests
npm run test:all
```

## 🎯 Test Coverage

### High Priority Tests (Critical Path)

#### 1. **ASIN Validation**
- ✅ Valid 10-character ASINs
- ✅ Amazon URL parsing
- ✅ Invalid format rejection
- ✅ Case sensitivity handling

#### 2. **Form Validation**
- ✅ Email format validation
- ✅ Required field validation
- ✅ Keyword count limits
- ✅ Description length limits

#### 3. **API Endpoints**
- ✅ `/api/preview` - Both existing and new seller previews
- ✅ `/api/report` - Full report generation
- ✅ `/api/register` - User account creation
- ✅ Error handling and validation

#### 4. **User Flows**
- ✅ Existing seller audit flow
- ✅ New seller creation flow
- ✅ Guest access and upgrade flow
- ✅ AI keyword suggestions

#### 5. **UI Components**
- ✅ Mode toggle functionality
- ✅ Sticky navigation
- ✅ Form interactions
- ✅ Responsive design

## 🔧 Test Configuration

### Jest Configuration (`jest.config.js`)
- Uses Next.js Jest configuration
- JSdom environment for React testing
- Coverage thresholds: 70% across all metrics
- Path mapping for `@/` imports

### Playwright Configuration (`playwright.config.js`)
- Tests on Chrome, Firefox, Safari, and mobile browsers
- Automatic server startup for E2E tests
- Screenshot capture on failures
- Trace collection for debugging

## 🚦 CI/CD Integration

### GitHub Actions Workflow (`.github/workflows/test.yml`)

The automated testing pipeline includes:

1. **Unit & Integration Tests**
   - Type checking with TypeScript
   - ESLint code quality checks
   - Jest unit and integration tests
   - Coverage reporting

2. **E2E Tests**
   - Playwright browser testing
   - Cross-browser compatibility
   - Mobile responsiveness testing

3. **Security Tests**
   - NPM audit for vulnerabilities
   - Dependency security scanning

4. **Performance Tests**
   - Lighthouse CI for performance metrics
   - Core Web Vitals monitoring

## 📊 Test Data Requirements

### For Unit Tests
- Valid/invalid ASINs: `B08N5WRWNW`, `invalid-asin`
- Test emails: `test@example.com`, `invalid-email`
- Sample product data and descriptions

### For Integration Tests
- Mock external API responses
- Test database operations
- Email service mocking

### For E2E Tests
- Real Amazon ASINs for testing
- Test website URLs for scraping
- Test user accounts and emails

## 🐛 Debugging Tests

### Unit Test Debugging
```bash
# Run specific test file
npm test -- validation.test.ts

# Run with verbose output
npm test -- --verbose

# Run tests matching pattern
npm test -- --testNamePattern="ASIN"
```

### E2E Test Debugging
```bash
# Run with debug mode
npx playwright test --debug

# Run specific test file
npx playwright test existing-seller.spec.ts

# Run with trace viewer
npx playwright test --trace on
```

### Common Issues

1. **Tests timing out**: Increase timeout in test configuration
2. **Mock failures**: Check mock implementations in test files
3. **Environment variables**: Ensure test environment is properly configured
4. **Browser issues**: Update Playwright browsers with `npx playwright install`

## 📈 Coverage Goals

- **Unit Tests**: 90%+ coverage for utility functions
- **Integration Tests**: 80%+ coverage for API endpoints
- **E2E Tests**: 100% coverage of critical user flows

## 🔄 Test Maintenance

### Adding New Tests
1. **Unit Tests**: Add to appropriate test file in `tests/unit/`
2. **Integration Tests**: Add to `tests/integration/api.test.ts`
3. **E2E Tests**: Create new spec file in `tests/e2e/`

### Test Naming Convention
- Unit tests: `describe('Function Name', () => { test('should do something', () => {}) })`
- E2E tests: `test('should complete user flow', async ({ page }) => {})`

### Mock Strategy
- Mock external services (OpenAI, Supabase, Resend)
- Use real validation logic for form tests
- Mock API responses for consistent testing

## 🎯 Testing Priorities

### Phase 1: Core Functionality ✅
- [x] ASIN validation and parsing
- [x] Form validation rules
- [x] API endpoint testing
- [x] Basic user flows

### Phase 2: Enhanced Testing (Next)
- [ ] Performance testing
- [ ] Accessibility testing
- [ ] Security testing
- [ ] Load testing

### Phase 3: Advanced Testing (Future)
- [ ] Visual regression testing
- [ ] Cross-browser compatibility
- [ ] Mobile app testing
- [ ] API load testing

## 📞 Support

For testing questions or issues:
1. Check this README first
2. Review test files for examples
3. Check GitHub Actions logs for CI failures
4. Run tests locally to reproduce issues

---

**Remember**: Good tests are fast, reliable, and maintainable. Focus on testing behavior, not implementation details.

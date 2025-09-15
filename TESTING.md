# Testing Guide

This project includes comprehensive testing setup with both unit tests and end-to-end tests.

## Testing Stack

- **Unit Tests**: Vitest with Vue Test Utils
- **E2E Tests**: Cypress
- **Coverage**: v8 coverage provider

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### E2E Tests

```bash
# Open Cypress Test Runner
npm run cypress:open

# Run E2E tests headlessly
npm run cypress:run
```

## Test Structure

### Unit Tests
- `src/components/__tests__/` - Component unit tests
- `src/views/__tests__/` - View unit tests  
- `src/store/__tests__/` - Store unit tests

### E2E Tests
- `cypress/e2e/` - End-to-end test files
- `cypress/support/` - Custom commands and configuration

## Test Coverage

Current coverage includes:
- ✅ HabitList component
- ✅ Login view
- ✅ Habits store
- ✅ Basic component rendering
- ✅ Store initialization

## Writing Tests

### Component Tests
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MyComponent from '../MyComponent.vue'

describe('MyComponent', () => {
  let wrapper: any

  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(MyComponent, {
      global: {
        plugins: [createPinia()],
      },
    })
  })

  it('renders correctly', () => {
    expect(wrapper.find('h1').text()).toBe('Expected Text')
  })
})
```

### E2E Tests
```typescript
describe('Feature', () => {
  it('should work end-to-end', () => {
    cy.visit('/')
    cy.get('[data-cy="button"]').click()
    cy.url().should('include', '/expected-page')
  })
})
```

## Data Attributes

Components include `data-cy` attributes for reliable E2E testing:
- `data-cy="email-input"` - Email input field
- `data-cy="password-input"` - Password input field
- `data-cy="login-button"` - Login button
- `data-cy="habit-title-input"` - Habit title input
- `data-cy="habit-form"` - Habit form
- `data-cy="add-habit-button"` - Add habit button

## Continuous Integration

Tests are configured to run in CI/CD pipelines:
- Unit tests run on every commit
- E2E tests run on pull requests
- Coverage reports are generated and tracked

## Best Practices

1. **Unit Tests**: Test component behavior, not implementation details
2. **E2E Tests**: Test critical user journeys
3. **Coverage**: Aim for >80% coverage on critical paths
4. **Data Attributes**: Use `data-cy` for reliable element selection
5. **Mocking**: Mock external dependencies and APIs
6. **Isolation**: Each test should be independent and isolated

describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display login form', () => {
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').should('be.visible');
    cy.get('[data-cy="password-input"]').should('be.visible');
    cy.get('[data-cy="login-button"]').should('be.visible');
  });

  it('should show validation errors for empty form', () => {
    cy.visit('/login');
    cy.get('[data-cy="login-button"]').click();
    cy.get('[data-cy="error-message"]').should('be.visible');
  });

  it('should navigate to signup page', () => {
    cy.visit('/login');
    cy.get('[data-cy="signup-link"]').click();
    cy.url().should('include', '/signup');
  });

  it('should display signup form', () => {
    cy.visit('/signup');
    cy.get('[data-cy="email-input"]').should('be.visible');
    cy.get('[data-cy="password-input"]').should('be.visible');
    cy.get('[data-cy="confirm-password-input"]').should('be.visible');
    cy.get('[data-cy="signup-button"]').should('be.visible');
  });

  it('should show password mismatch error', () => {
    cy.visit('/signup');
    cy.get('[data-cy="email-input"]').type('test@example.com');
    cy.get('[data-cy="password-input"]').type('password123');
    cy.get('[data-cy="confirm-password-input"]').type('different123');
    cy.get('[data-cy="signup-button"]').click();
    cy.get('[data-cy="error-message"]').should('contain', 'password');
  });
});

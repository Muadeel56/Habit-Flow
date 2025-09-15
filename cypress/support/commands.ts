// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      createHabit(title: string, description?: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add(
  'login',
  (email = 'test@example.com', password = 'password123') => {
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type(email);
    cy.get('[data-cy="password-input"]').type(password);
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('include', '/dashboard');
  }
);

Cypress.Commands.add('createHabit', (title: string, description = '') => {
  cy.visit('/habits');
  cy.get('[data-cy="add-habit-button"]').click();
  cy.get('[data-cy="habit-title-input"]').type(title);
  if (description) {
    cy.get('[data-cy="habit-description-input"]').type(description);
  }
  cy.get('[data-cy="save-habit-button"]').click();
  cy.get('[data-cy="habit-list"]').should('contain', title);
});

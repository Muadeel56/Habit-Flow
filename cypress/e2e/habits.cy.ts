describe('Habit Management', () => {
  beforeEach(() => {
    // Mock authentication for these tests
    cy.window().then(win => {
      win.localStorage.setItem('auth-token', 'mock-token');
    });
  });

  it('should display habits page', () => {
    cy.visit('/habits');
    cy.get('[data-cy="habits-page"]').should('be.visible');
    cy.get('[data-cy="add-habit-button"]').should('be.visible');
  });

  it('should open habit creation form', () => {
    cy.visit('/habits');
    cy.get('[data-cy="add-habit-button"]').click();
    cy.get('[data-cy="habit-form"]').should('be.visible');
    cy.get('[data-cy="habit-title-input"]').should('be.visible');
    cy.get('[data-cy="habit-description-input"]').should('be.visible');
    cy.get('[data-cy="habit-frequency-select"]').should('be.visible');
  });

  it('should show validation error for empty title', () => {
    cy.visit('/habits');
    cy.get('[data-cy="add-habit-button"]').click();
    cy.get('[data-cy="save-habit-button"]').click();
    cy.get('[data-cy="error-message"]').should('contain', 'required');
  });

  it('should create a new habit', () => {
    cy.visit('/habits');
    cy.get('[data-cy="add-habit-button"]').click();
    cy.get('[data-cy="habit-title-input"]').type('Test Habit');
    cy.get('[data-cy="habit-description-input"]').type('This is a test habit');
    cy.get('[data-cy="habit-frequency-select"]').select('daily');
    cy.get('[data-cy="save-habit-button"]').click();

    // Should close form and show success
    cy.get('[data-cy="habit-form"]').should('not.exist');
    cy.get('[data-cy="habit-list"]').should('contain', 'Test Habit');
  });

  it('should display habit filters', () => {
    cy.visit('/habits');
    cy.get('[data-cy="habit-filters"]').should('be.visible');
    cy.get('[data-cy="filter-all"]').should('be.visible');
    cy.get('[data-cy="filter-active"]').should('be.visible');
    cy.get('[data-cy="filter-completed"]').should('be.visible');
  });

  it('should filter habits by status', () => {
    cy.visit('/habits');
    cy.get('[data-cy="filter-active"]').click();
    cy.get('[data-cy="habit-list"]').should('be.visible');
  });
});

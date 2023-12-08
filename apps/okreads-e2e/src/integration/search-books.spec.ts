describe('When: Use the search feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should be able to see search results as I am typing', () => {
    cy.get('input[type="search"]').type('javascript');

    cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 1);
  });
});

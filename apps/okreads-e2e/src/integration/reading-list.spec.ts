describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

  it('Then: I should be able to mark a book as finished', () => {
    // searching book
    cy.searchBook('ngrx');

    // adding book to the reading list
    cy.get('[data-testing="add-book-button"]:enabled')
      .first()
      .should('exist')
      .click();

    // opening reading list
    cy.get('[data-testing="toggle-reading-list"]').click();

    // marking book as read
    cy.get('.reading-list-item')
      .last()
      .find('.mark-finish-circle')
      .should('exist')
      .click();
    cy.get('.reading-list-item').last().should('contain.text', 'Finished on');

    // removing book from the list
    cy.get('[data-testing="remove-book-button"]:enabled')
      .last()
      .should('exist')
      .click();

    // closing reading list
    cy.get('[data-testing="close-reading-list"]').click();

    // adding book to the reading list
    cy.get('[data-testing="add-book-button"]:enabled')
      .first()
      .should('exist')
      .click();

    // opening reading list
    cy.get('[data-testing="toggle-reading-list"]').click();

    // For the same book, finish button should be visible
    cy.get('.reading-list-item')
      .last()
      .find('.mark-finish-circle')
      .should('exist');
  });
});

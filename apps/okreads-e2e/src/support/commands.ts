// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      startAt: typeof startAt;
      searchBook: typeof searchBook;
    }
  }
}

export function startAt(url) {
  cy.visit(url);
  cy.get('tmo-root').should('contain.text', 'okreads');
}

export function searchBook(book: string) {
  cy.get('input[type="search"]').type(book);
  cy.get('form').submit();
}

Cypress.Commands.add('startAt', startAt);
Cypress.Commands.add('searchBook', searchBook);

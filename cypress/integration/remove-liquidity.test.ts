describe('Remove Liquidity', () => {
  it('redirects', () => {
    cy.visit('/remove/0xe4F33753BdEc9717F90C9dc9f381290fB9F6F701-0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85')
    cy.url().should(
      'contain',
      '/remove/0xe4F33753BdEc9717F90C9dc9f381290fB9F6F701/0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85'
    )
  })

  it('eth remove', () => {
    cy.visit('/remove/HSK/0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'HSK')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'MKR')
  })

  it('eth remove swap order', () => {
    cy.visit('/remove/0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85/HSK')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'MKR')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'HSK')
  })

  it('loads the two correct tokens', () => {
    cy.visit('/remove/0xe4F33753BdEc9717F90C9dc9f381290fB9F6F701-0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'WETH')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'MKR')
  })

  it('does not crash if HSK is duplicated', () => {
    cy.visit('/remove/0xe4F33753BdEc9717F90C9dc9f381290fB9F6F701-0xe4F33753BdEc9717F90C9dc9f381290fB9F6F701')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'WETH')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'WETH')
  })

  it('token not in storage is loaded', () => {
    cy.visit('/remove/0xb290b2f9f8f108d03ff2af3ac5c8de6de31cdf6d-0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'SKL')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'MKR')
  })
})

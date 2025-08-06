// Cypress version of Playwright sign-up helpers
// Only const and exports, no test blocks or Playwright-specific code
import { faker } from '@faker-js/faker';

// Set country or currency
const setCountry = (country) => {
  switch (country) {
    case 'Cyprus':
      cy.get('label[for="Country"]').should('be.visible').and('contain', 'Cyprus');
      break;
    case 'Belgium':
      cy.get('label[for="Country"]').should('be.visible');
      cy.get('select[name="Country"]').select('3');
      cy.get('label[for="Country"]').should('contain', 'Belgium');
      break;
  }
};

// Set postal code or phone number based on country
const setPhoneOrPostalCode = (country) => {
  switch (country) {
    case 'Cyprus':
      cy.get('input[name="Phone"]').type('99' + faker.string.numeric(6));
      cy.get('input[name="Postal code"]').type('4233');
      break;
    case 'Belgium':
      cy.get('input[name="Phone"]').type('470' + faker.string.numeric(6));
      // cy.get('input[name="Postal code"]').type('1000');
      break;
    default:
      throw new Error(`Unknown country: ${country}`);
  }
};

// Check bonus section
const bonusSection = (bonusType) => {
  cy.contains('Choose your bonus').should('be.visible');
  cy.get('.hidden.px-3').within(() => {
    cy.contains('Choose your bonus Elevate your casino journey with a welcome bonus. Slots').should('be.visible');
    cy.contains('Slots package').should('be.visible');
    cy.contains('Live package').should('be.visible');
    cy.contains('Sports package').should('be.visible');
    cy.contains("I don't want a bonus").should('be.visible');
    switch (bonusType) {
      case 'Live package':
        cy.get('.package-list.package-list--live .package-list__check-box').first().click();
        break;
      case 'Sports package':
        cy.get('.package-list.package-list--sports .package-list__check-box').first().click();
        break;
      case 'No Bonus':
        cy.contains("I don't want a bonus").click();
      default:
        cy.get('.package-list__check-box').first().should('be.visible');
        break;
    }
  });
};
// Fill step 1 of the sign-up form
const signUpFormStep1 = (country, bonusType) => {
  const customerData = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: '99' + faker.string.numeric(6),
    postalCode: '4233',
    birthDate: {
      day: '0' + String(faker.number.int({ min: 1, max: 9 })),
      month: String(faker.number.int({ min: 1, max: 9 })),
      year: String(faker.number.int({ min: 1950, max: 2005 }))
    }
  };
  bonusSection(bonusType);
  cy.contains('Step 1/2').should('be.visible');
  cy.contains('Step 1/2 Create an account').should('be.visible');
  cy.get('input[name="Email"]').clear().type(customerData.email);
  cy.writeFileSync('./cypress/fixtures/customerData.json', { email: customerData.email });
  cy.get('input[name="Password"]').clear().type(customerData.password);
  cy.writeFileSync('./cypress/fixtures/customerData.json', { password: customerData.password });
  setCountry(country);
  cy.contains('Currency').should('be.visible');
  cy.get('select[name="Currency"]').should('have.value', 'Euro');
  cy.contains('I am over 18 years old and I').should('be.visible');
  cy.contains('I agree to receive marketing').should('be.visible');
  cy.contains('button', 'Continue').should('be.visible').click();
};

// Fill step 2 of the sign-up form
const signUpFormStep2 = (country) => {
  const customerData = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: '4233',
    birthDate: {
      day: '0' + String(faker.number.int({ min: 1, max: 9 })),
      month: String(faker.number.int({ min: 1, max: 9 })),
      year: String(faker.number.int({ min: 1950, max: 2005 }))
    }
  };
  cy.contains('Step 2/2').should('be.visible');
  cy.contains('Step 2/2 Create an account').should('be.visible');
  cy.get('input[name="First name"]').type(customerData.firstName);
  cy.get('input[name="Last name"]').type(customerData.lastName);
  setPhoneOrPostalCode(country);
  cy.get('select[name="Day"]').select(customerData.birthDate.day);
  cy.get('select[name="Month"]').select(customerData.birthDate.month);
  cy.get('select[name="Year"]').select(customerData.birthDate.year);
  cy.contains('button', 'Go Back').should('be.visible');
  cy.contains('button', 'Register').should('be.visible').click();
};

export { setCountry, setPhoneOrPostalCode, bonusSection, signUpFormStep1, signUpFormStep2 };

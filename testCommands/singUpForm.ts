// Step 1 of the sign-up form test
import { test, expect } from '@playwright/test';
import { faker, ne, th } from '@faker-js/faker';
import fs from 'fs';
import { time } from 'console';


//helper command to set Country  or Currency
const setCountry = async (section, country) => {
    switch (country) {
        case 'Cyprus':
            await expect(section.getByLabel('Country', { exact: true })).toBeVisible();
            await expect(section.getByLabel('Country', { exact: true })).toHaveText(/Cyprus/);
            break;
        case 'Belgium':
            await expect(section.getByLabel('Country', { exact: true })).toBeVisible();
            await section.getByLabel('Country', { exact: true }).selectOption('3');
            await expect(section.getByLabel('Country', { exact: true })).toHaveText(/Belgium/);
            break;
    }
}
//helper command to set postal code or phonenumber based on country
const setPhoneOrPostalCode = async (section, country) => {
    switch (country) {
        case 'Cyprus':
            await section.getByRole('textbox', { name: 'Phone' }).type('99' + faker.string.numeric(6));
            await section.getByRole('textbox', { name: 'Postal code' }).type('4233');
            break;
        case 'Belgium':
            await section.getByRole('textbox', { name: 'Phone' }).type('470' + faker.string.numeric(6));
            
          //  await section.getByRole('textbox', { name: 'Postal code' }).type('1000');
            break;
        default:
            throw new Error(`Unknown country: ${country}`);
    }
}

//helper command to check bonus section
const bonusSection = async (page, bonusType?:string) => {

    //check if bonus block wiith radio button is visible
    await expect(page.locator('body')).toContainText('Choose your bonus');

    //check if  options are visible
    const bonusSection =  page.locator('.hidden.px-3')
    await expect(bonusSection.getByText('Choose your bonus Elevate your casino journey with a welcome bonus. Slots')).toBeVisible();

    // check if any option is visible individually
    await expect(bonusSection.getByText('Slots package')).toBeVisible();
    await expect(bonusSection.getByText('Live package')).toBeVisible();
    await expect(bonusSection.getByText('Sports package')).toBeVisible();
    await expect(bonusSection.getByRole('button', { name: 'I don\'t want a bonus' })).toBeVisible();

    switch (bonusType) {
        case 'Live package':
            await page.locator('.package-list.package-list--live > .package-list__header > .package-list__check-box').first().click();
            break;
        case 'Sports package':
            await page.locator('.package-list.package-list--sports > .package-list__header > .package-list__check-box').first().click();
            break;
        case 'No Bonus':
            await bonusSection.getByRole('button', { name: 'I don\'t want a bonus' }).click();
        default:
            const checkBox = bonusSection.locator('.package-list__check-box').first();
            await expect(checkBox).toBeVisible({ timeout: 5000 });
             
            break;
    }
}

//fill step 1 of the sign-up form
export const signUpFormStep1 = async (page, country, bonusType?:string) => {

    //customer data for the sign-up form

    const customerData = {

        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: '99' + faker.string.numeric(6), // Simulating a phone number starting with 9
        postalCode: '4233',
        birthDate: {
            day: "0" + String(faker.number.int({ min: 1, max: 9 })),
            month: String(faker.number.int({ min: 1, max: 9 })),
            year: String(faker.number.int({ min: 1950, max: 2005 }))
        }

    }

    //check if bonuses are visible and select one 
    bonusSection(page, bonusType);

    await expect(page.locator('body')).toContainText('Step 1/2');
    await expect(page.getByText('Step 1/2 Create an account')).toBeVisible();

    //get from parent element the fields inside the section
    const section = page.getByText('Step 1/2 Create an account').locator('..'); // get parent if needed

    await expect(section).toBeVisible();

    // fill email robustly
    const emailInput = section.getByRole('textbox', { name: 'Email' });
    await expect(emailInput).toBeVisible({ timeout: 7000 });
    await emailInput.fill(''); // clear any pre-filled value
    await emailInput.fill(customerData.email, { delay: 50 });
    // Wait for the value to be set correctly
    await expect(emailInput).toHaveValue(customerData.email, { timeout: 3000 });
    await page.waitForTimeout(400); // small wait for UI
    console.log(`Generated email: ${customerData.email}`);
     // expect(section.getByRole('textbox', { name: 'Email' })).toContainText(customerData.email, { timeout: 5000 })
        

    // Append email to file instead of overwriting
    const emailFile = './environments/generatedUsersCredentials.json';
    let emails: any[] = [];
    try {
        const parsed = JSON.parse(fs.readFileSync(emailFile, 'utf-8'));
        if (Array.isArray(parsed)) {
            emails = parsed;
        } else if (parsed && typeof parsed === 'object') {
            emails = [parsed];
        }
    } catch (e) { }
    emails.push({ email: customerData.email });
    fs.writeFileSync(emailFile, JSON.stringify(emails, null, 2));



    //fill password
    expect(section.getByRole('textbox', { name: 'Password' })).toBeVisible({ timeout: 5000 });
    await section.getByRole('textbox', { name: 'Password' }).fill(customerData.password,{timeout: 5000});
    await expect(section.getByRole('textbox', { name: 'Password' })).toHaveValue(customerData.password, { timeout: 3000 });
    await page.waitForTimeout(400); // small wait for UI
    console.log(`Generated email: ${customerData.password}`);
    
    // Append password to file instead of overwriting
    const passFile = './environments/generatedUsersCredentials.json';
    let passwords: any[] = [];
    try {
        const parsed = JSON.parse(fs.readFileSync(passFile, 'utf-8'));
        if (Array.isArray(parsed)) {
            passwords = parsed;
        } else if (parsed && typeof parsed === 'object') {
            passwords = [parsed];
        }
    } catch (e) { }
    passwords.push({ password: customerData.password });
    fs.writeFileSync(passFile, JSON.stringify(passwords, null, 2));


    //check currency and country
    //inside of the country element to assert visibility and text
    setCountry(section, country);

    //check currency
    const currencyElement = section.getByText('Currency');
    await expect(currencyElement).toBeVisible();
    await expect(section.getByLabel('Currency')).toMatchAriaSnapshot(`
    - combobox "Currency":
      - option "Euro" [selected]
    `);

  //check if agreement checkboxes are visible
  await expect(page.getByText('I am over 18 years old and I')).toBeVisible();
  await expect(page.getByText('I agree to receive marketing')).toBeVisible();

   //click to Continue
    await expect(section.getByRole('button', { name: 'Continue' })).toBeVisible();
    await section.getByRole('button', { name: 'Continue' }).click();

}

// fill the step 2 of the sign-up form
export const signUpFormStep2 = async (page, country) => {

    //customer data for the sign-up form
    const customerData = {

        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        // Cyphone: '99' + faker.string.numeric(6), 
        // BLphone: '470' + faker.string.numeric(6), 
        postalCode: '4233',
        birthDate: {
            day: "0" + String(faker.number.int({ min: 1, max: 9 })),
            month: String(faker.number.int({ min: 1, max: 9 })),
            year: String(faker.number.int({ min: 1950, max: 2005 }))
        }

    }
    await expect(page.locator('body')).toContainText('Step 2/2', { timeout: 5000 });
    await expect(page.getByText('Step 2/2 Create an account')).toBeVisible();
    //get from parent element the fields inside the section
    const section = page.getByText('Step 2/2 Create an account').locator('..'); // get parent if needed
    //check if section is visible
    await expect(section).toBeVisible();
    //fill first name
    await section.getByRole('textbox', { name: 'First name' }).type(customerData.firstName);
    //fill last name
    await section.getByRole('textbox', { name: 'Last name' }).type(customerData.lastName);

    //fill phone  //fill postal code
    page.pause();
    setPhoneOrPostalCode(section, country); // or 'Belgium' based on your test case


    //select day, month and year for date of birth
    await section.getByLabel('Day').selectOption(customerData.birthDate.day);
    await section.getByLabel('Month').selectOption(customerData.birthDate.month);
    await section.getByLabel('Year', { exact: true }).selectOption(customerData.birthDate.year);

    //check if Go Back button is visible
    await expect(section.getByRole('button', { name: 'Go Back' })).toBeVisible();

    //click on Register button
    await expect(section.getByRole('button', { name: 'Register' })).toBeVisible();
   

    // Set up the interception and wait for the API after clicking Register
    const authPromise = interceptAuthenticationAPI(page, async (response, request) => {
        console.log('Authentication API intercepted:', response.status());
        // Save response body to JSON file
        const body = await response.json();
        const filePath = './environments/authApiResponse.json';
        fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
        console.log('Saved authentication API response to', filePath);
    });
    await section.getByRole('button', { name: 'Register' }).click({ timeout: 5000 });
    await authPromise;
}

//intercept authentication API
const interceptAuthenticationAPI = (page, onResponse) => {
    return new Promise(resolve => {
        page.route('**/broadcasting/auth', async (route, request) => {
            const response = await route.fetch();
            if (onResponse) {
                onResponse(response, request);
            }
            route.fulfill({ response });
            resolve({ response, request });
        });
    });
}

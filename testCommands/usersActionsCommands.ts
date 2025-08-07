
import { test, expect } from '@playwright/test';
import { error } from 'console';
import fs from 'fs';
import path from 'path';
import { ArrayOptions } from 'stream';



//bonus confirmation helper comman
const bonusConfirmation = async (page, bonus) => {
    if (bonus) {
        await expect(page.getByText('You have selected a bonus.')).toBeVisible();
    } else {
        await expect(page.getByText('You have not selected a bonus.')).toBeVisible();
    }
};

//assert user ammount balance after sign up

const userBalance = async (page, amount: any, bonusamount?: any) => {
   let confirmationAmount = amount != null ? amount.toString() : '';

    

  if (amount < 0) {
    throw new Error(`Invalid amount: ${amount} is below 0`);
  }

  if (amount === 0) {
    await expect(page.getByRole('complementary')).toContainText(
      'EUR €0.00 Balance €0.00 Cash balance €0.00 Bonus balance'
    );
  } else {
    // Case: amount > 0
    await expect(page.getByRole('complementary')).toContainText(
      `EUR €${confirmationAmount}.00 Balance €${confirmationAmount}.00 Cash balance €${confirmationAmount}.00 Bonus balance €${bonusamount}.00`
    );
  }
};

//set dynamic date/time for transaction history
const setTransactionDate = (): string => {
    const newDate = new Date();

    const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'UTC',
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions);
    const formattedDateTime = formattedDate.formatToParts(newDate);

    const getPart = (type: string) =>
        formattedDateTime.find(p => p.type === type)?.value ?? '';

    const completedText = `Completed ${getPart('month')} ${getPart('day')}, ${getPart('year')} ${getPart('hour')}:${getPart('minute')}:`;

    return completedText;
};

//history of user balance
const userDepositHistory = async (page, amount) => {

     let confirmationAmount = amount != null ? amount.toString() : '';
    //verify the balance history ammount
    await page.getByText(`€${confirmationAmount},00`).click();

    // set the transaction date
    const completedTransaction = setTransactionDate();

    // Check for the transaction history
    await expect (page.getByText(completedTransaction)).toBeVisible();
    console.log(`Transaction date verified: ${completedTransaction}`);

    //invoke transaction ID by following the sibling element
    const idLocator = page
        .locator('.card-history__progress')
        .locator('text=Transaction ID')
        .locator('xpath=following-sibling::*[1]');

    //invoke transaction ID text content
    const transactionId = await idLocator.textContent();
    console.log('Transaction ID:', transactionId);

};

//deposit with payment method helper commands
const depositWithCreditcard = async (page, amount) => {
    //set the any(number) to a string 
    let confirmationAmount = amount != null ? amount.toString() : '';


    //add the amount for deposit
    await expect(page.locator('form')).toContainText('VISA & Mastercard');
    await page.getByRole('textbox', { name: 'EUR' }).fill('');
    await page.getByRole('textbox', { name: 'EUR' }).fill(confirmationAmount);


    //extract the bonus ammoun for later use
    //locate parent element of text
    const bonusElement = page.locator('.deposit-amount__bonus-text');
    const bonusNumber = await bonusElement.textContent();
    const filePath = path.resolve('./environments/bonusAmount.json');

    //remove un text to keep only bonus ammount
    const amountMatch = bonusNumber?.match(/€(\d+(\.\d+)?)/);
    let bonusAmount = amountMatch ? parseFloat(amountMatch[1]) : null;

    //save in it in json file
    // Step 5: Write the bonus amount to file using writeFileSync
    fs.writeFileSync(filePath, JSON.stringify({ bonus: bonusAmount }, null, 2), 'utf-8');


    console.log('Bonus amount:', bonusAmount);

    //cart details 
    await page.getByRole('textbox', { name: 'Card number' }).click();
    await page.getByRole('textbox', { name: 'Card number' }).fill('4000 0000 0000 0804');
    await page.getByRole('textbox', { name: 'Expiration date' }).click();
    await page.getByRole('textbox', { name: 'Expiration date' }).fill('02/28');
    await page.getByRole('textbox', { name: 'CVV/CVC' }).click();
    await page.getByRole('textbox', { name: 'CVV/CVC' }).fill('323');
    await expect(page.getByRole('button', { name: 'Deposit' })).toBeEnabled();
    await page.getByRole('button', { name: 'Deposit' }).click();
    // validation after deposit

   /* await page.getByText('Deposit successful').waitFor({ state: 'visible', timeout: 20000 })
    await expect(page.getByRole('main')).toContainText(`Your deposit was successful The amount of €${confirmationAmount}.00 has been added to your balance!`);

    // Check for success message
    await expect(page.getByText('Deposit successful')).toBeVisible();

    //validate buttons on confirmation page 
    await expect(page.getByRole('link', { name: 'Start playing' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'View History' })).toBeVisible();*/
    await page.getByRole('link', { name: 'Start playing' }).waitFor({ state: 'visible' });
    await page.getByRole('link', { name: 'View History' }).click()

}

//the helper command to complete deposit method
export const completeDepositMethod = async (page, method, amount) => {

    switch (method) {
        case 'Credit Card':
            await userBalance(page,0)
            await depositWithCreditcard(page, amount);
            await userDepositHistory(page,amount)
            //read the bonus.json 
           const bonusData = JSON.parse(fs.readFileSync('./environments/bonusAmount.json', 'utf-8'));
           const numBonus = bonusData.bonus.toString()
            console.log('Bonus read from file:', numBonus);
            //add the bonus to the parameter
            await userBalance(page, amount, numBonus); // Verify balance after deposit


            break;

        // Add more cases for other payment methods if needed later on
        default:

            throw new Error(`Unknown payment method: ${method}`);
    }

};

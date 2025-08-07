//import test  from playwright library
import {test,expect} from '@playwright/test';
//import baseURL from environment configuration
import {baseURL} from '../environments/dev.json'
//import header commands from test commands
import {headerButtons} from  '../testCommands/headerCommands.ts'
//import signUp command from test commands
import {signUpFormStep1,signUpFormStep2} from  '../testCommands/singUpForm.ts'
//import deposit commands from test commands file
import {completeDepositMethod} from '../testCommands/usersActionsCommands.ts';



test.describe('Automation Test Results', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(baseURL);
     await page.evaluate(() => localStorage.clear());
  });

  test('Sign Up Valid Customer Details - Without Bonus', async ({page}) => {
     await headerButtons(page, 'Sign up');
     await signUpFormStep1(page,'Finland',true,false,'No Bonus');
     await signUpFormStep2(page,'Finland');
  })

  test('e2e - Sign Up Valid Customer Details - With Bonus - Later Deposit With Bonus Credit Cart', async ({page}) => {
      await headerButtons(page, 'Sign up');
      await signUpFormStep1(page,'Finland',true);
      await signUpFormStep2(page,'Finland');
      console.log('Account Has been created - Will Deposit - Credit Cart')
      await completeDepositMethod(page,'Credit Card',25)
  });

 test('Log In To The Account - only', async ({page}) => {
    await headerButtons(page, 'Log in');
})
  test('Sign Up Invalid Customer Details Or Empty', async ({page}) => {
    // This test will run the sign-up form with invalid data
      await headerButtons(page, 'Sign up');
      await signUpFormStep1(page,'Finland',false,false);
      await signUpFormStep2(page,'Finland',false,false);
  console.log('test will reload to run empty data')
      //then rerun step 1 of the sign-up form with empty data
      page.reload({timeout:6000})
      await headerButtons(page, 'Sign up');
      await signUpFormStep1(page,'Finland',false,true);
      await signUpFormStep2(page,'Finland',false,true);

  });

});
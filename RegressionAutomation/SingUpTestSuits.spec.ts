//import test  from playwright library
import {test,expect} from '@playwright/test';
//import baseURL from environment configuration
import {baseURL} from '../environments/dev.json'
//import header commands from test commands
import {headerButtons} from  '../testCommands/headerCommands.ts'
//import signUp command from test commands
import {signUpFormStep1,signUpFormStep2} from  '../testCommands/singUpForm.ts'


test.describe('Sign Up Test Suite', () => {
  test.beforeEach(async ({page}) => {
    await  page.goto(baseURL);
    await page.evaluate(() => localStorage.clear());
  });

  test('Sign Up Valid Customer Details - Without Bonus', async ({page}) => {
     await headerButtons(page, 'Sign up');
     await signUpFormStep1(page,'Cyprus',true,false,'No Bonus');
     await signUpFormStep2(page,'Cyprus');
  })

  test('Sign Up Valid Customer Details - With Bonus', async ({page}) => {
      await headerButtons(page, 'Sign up');
      await signUpFormStep1(page,'Cyprus',true);
      await signUpFormStep2(page,'Cyprus');
  });

  test('Sign Up Invalid Customer Details Or Empty', async ({page}) => {
    // This test will run the sign-up form with invalid data
      await headerButtons(page, 'Sign up');
      await signUpFormStep1(page,'Cyprus',false,false);
      await signUpFormStep2(page,'Cyprus',false,false);

      //then rerun step 1 of the sign-up form with empty data
      page.reload({timeout:6000})
      await headerButtons(page, 'Sign up');
      await signUpFormStep1(page,'Cyprus',false,true);
      await signUpFormStep2(page,'Cyprus',false,true);

  });


});
//header page buttons for login and sign up
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export const headerButtons = async (page, button: string) => {
    switch (button) {
        case 'Sign up':
            await page.getByRole('button', { name: `${button}` }).click();
            break;
        case 'Log in':
            await page.getByRole('button', { name: `${button}` }).click();
            // Read values from files (synchronously)
            const emailData = JSON.parse(fs.readFileSync('./environments/generatedEmail.json', 'utf-8'));
            const passwordData = JSON.parse(fs.readFileSync('./environments/generatedPassword.json', 'utf-8'));

            // Extract values
            const email = emailData.email;
            const password = passwordData.password;

            // Use in Playwright
            await page.getByRole('textbox', { name: 'Email' }).fill(email);
            await page.getByRole('textbox', { name: 'Password' }).fill(password);


            //click in log in button     

            const authPromise = interceptAuthenticationAPI(page, async (response, request) => {
                console.log('Authentication API intercepted:', response.status());
                // Save response body to JSON file
                const body = await response.json();
                const filePath = './environments/authApiResponse.json';
                fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
                console.log('Saved authentication API response to', filePath);
            });
            const loginForm = page.locator('form').filter({ hasText: 'Email Password Forgot' });
            await loginForm.getByRole('button', { name: 'Log in' }).click();
            await authPromise;


            break;
        default:
            throw new Error(`Unknown button: ${button}`);
    }
}

//intercept authentication API
export const interceptAuthenticationAPI = (page, onResponse) => {
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


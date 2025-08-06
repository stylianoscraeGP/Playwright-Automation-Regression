//header page buttons for login and sign up
import { test, expect } from '@playwright/test';

export const headerButtons = async (page, button: string) => {
    switch (button) {
        case 'Sign up':
            await page.getByRole('button', { name: `${button}` }).click();
            break;
        case 'login':
            await page.getByRole('button', { name: `${button}` }).click();
            break;
        default:
            throw new Error(`Unknown button: ${button}`);
    }
}


import { test, expect } from '@playwright/test';

// מחלקת בסיס לבדיקות
class BaseLoginTest {
    readonly url = 'https://the-internet.herokuapp.com/login';

    async navigate(page) {
        await page.goto(this.url);
    }

    async login(page, username: string, password: string) {
        await page.fill('#username', username);
        await page.fill('#password', password);

        // ✅ תיקון באג מספר 1: הסלקטור הנכון של כפתור ההתחברות הוא submit ולא button
        await page.click('button[type="submit"]');
    }

    async getFlashMessage(page): Promise<string> {
        const flashElement = await page.locator('#flash');
        
        // ✅ תיקון באג מספר 3: שימוש נכון בפונקציה await flashElement.innerText() 
        await flashElement.waitFor(); // המתנה להופעת ההודעה (אם דרוש)
        return await flashElement.innerText(); 
    }
}

const loginTest = new BaseLoginTest();

// ✅ בדיקה 1: כניסה מוצלחת עם פרטי משתמש נכונים
test('Successful login', async ({ page }) => {
    await loginTest.navigate(page);
    await loginTest.login(page, 'tomsmith', 'SuperSecretPassword!');
    const message = await loginTest.getFlashMessage(page);

    // ✅ תיקון באג מספר 2: ההודעה המתקבלת שונה - מעדכנים את הציפייה לטקסט הנכון
    expect(message).toContain('You logged into a secure area!');
});

// ✅ בדיקה 2: כניסה עם סיסמה שגויה
test('Login with incorrect password', async ({ page }) => {
    await loginTest.navigate(page);
    await loginTest.login(page, 'tomsmith', 'WrongPassword');
    const message = await loginTest.getFlashMessage(page);

    // ✅ תיקון באג מספר 2: התאמת ההודעה לציפייה הנכונה
    expect(message).toContain('Your password is invalid!');
});

// ✅ בדיקה 3: כניסה עם שם משתמש שגוי
test('Login with incorrect username', async ({ page }) => {
    await loginTest.navigate(page);
    await loginTest.login(page, 'wrongUser', 'SuperSecretPassword!');
    const message = await loginTest.getFlashMessage(page);

    // ✅ תיקון באג מספר 2: התאמת ההודעה לציפייה הנכונה
    expect(message).toContain('Your username is invalid!');
});

// ✅ בדיקה 4: כניסה ללא שם משתמש
test('Login without username', async ({ page }) => {
    await loginTest.navigate(page);
    await loginTest.login(page, '', 'SuperSecretPassword!');
    const message = await loginTest.getFlashMessage(page);

    // ✅ תיקון באג מספר 2: התאמת ההודעה לציפייה הנכונה
    expect(message).toContain('Your username is invalid!');
});

// ✅ בדיקה 5: כניסה ללא סיסמה
test('Login without password', async ({ page }) => {
    await loginTest.navigate(page);
    await loginTest.login(page, 'tomsmith', '');
    const message = await loginTest.getFlashMessage(page);

    // ✅ תיקון באג מספר 2: התאמת ההודעה לציפייה הנכונה
    expect(message).toContain('Your password is invalid!');
});

// ✅ בדיקה 6: בדיקת הופעת הודעות שגיאה
test('Check error message styling', async ({ page }) => {
    await loginTest.navigate(page);
    await loginTest.login(page, 'tomsmith', 'WrongPassword');
    const flashElement = await page.locator('#flash');
    const isVisible = await flashElement.isVisible();

    expect(isVisible).toBe(true);
});

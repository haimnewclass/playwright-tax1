import { chromium } from 'playwright';
import fs from 'fs';
import axios from 'axios';

const API_KEY = 'YOUR_OPENAI_API_KEY';
const URL = 'https://example.com'; // כתובת האתר שברצונך לסרוק

async function scanWebsite(url: string) {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url);
    const allElements = await page.$$('*');

    const elementsInfo = await Promise.all(allElements.map(async (element) => {
        const tagName = await element.evaluate(el => el.tagName);
        const textContent = await element.evaluate(el => el.textContent);
        const attributes = await element.evaluate(el => Array.from(el.attributes).map(attr => ({ name: attr.name, value: attr.value })));

        return { tagName, textContent, attributes };
    }));

    fs.writeFileSync('./elements.json', JSON.stringify(elementsInfo, null, 2));
    console.log('✅ Website scanned successfully!');
    await browser.close();
}

async function generateTests() {
    const elements = JSON.parse(fs.readFileSync('./elements.json', 'utf-8'));

    const prompt = `
אני רוצה שתיצור סדרת בדיקות Playwright לפי האלמנטים הבאים:
${JSON.stringify(elements, null, 2)}

הדגש על:
- ניווט בעמודים
- בדיקת לחצנים
- בדיקת קישורים
- בדיקת מילוי טפסים
- בדיקת הימצאות טקסטים
- בדיקת שגיאות  
- ועוד רעיונות נוספים שיש לך

בנוסף, עבור כל בדיקה שאתה כותב, הוסף הערות מפורטות בקוד שמסבירות:
- מה נבדק?
- מהי המטרה של הבדיקה?
- אילו אלמנטים מעורבים בבדיקה?

החזר את הקוד בתבנית TypeScript עם הערות ברורות.
    `;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        const generatedCode = response.data.choices[0].message.content;

        fs.writeFileSync('./tests/generatedTests.spec.ts', generatedCode);
        console.log('✅ Tests generated successfully!');
    } catch (error) {
        console.error('❌ Error generating tests:', error.message);
    }
}

async function main() {
    console.log('🔍 סורק את האתר...');
    await scanWebsite(URL);

    console.log('🤖 יוצר בדיקות באמצעות GPT...');
    await generateTests();

    console.log('✅ תהליך יצירת הבדיקות הושלם!');
}

main();

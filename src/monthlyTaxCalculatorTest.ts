import { test, expect } from '@playwright/test';
import { BaseTaxCalculatorTest } from './baseTaxCalculatorTest';

test('חישוב מס חודשי', async ({ page }) => {
  const calculator = new BaseTaxCalculatorTest(page);

  await calculator.navigate();
  await page.click('text=חישוב חודשי'); // ודא שזהו הכפתור הנכון לשינוי לחישוב חודשי

  const income = calculator.getRandomIncome(true);
  const creditPoints = calculator.getRandomCreditPoints();

  await calculator.enterIncome(income);
  await calculator.enterCreditPoints(creditPoints);
  await calculator.clickCalculate();

  const result = await calculator.getResult();
  console.log(`Income: ${income}, Credit Points: ${creditPoints}, Result: ${result}`);

  expect(result).not.toBeNull();
});

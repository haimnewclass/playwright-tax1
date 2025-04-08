import { Page, Locator, expect } from '@playwright/test';

export abstract class BaseTaxCalculatorTest {
  readonly incomeInput: Locator;
  readonly creditPointsInput: Locator;
  readonly calculateButton: Locator;
  readonly resultText: Locator;
  readonly Page: Page;
  constructor(page: Page) {
    this.Page = page;
    this.incomeInput = page.locator('#salaryInput');
    this.creditPointsInput = page.locator('#creditPointsInput');
    this.calculateButton = page.locator('button:has-text("חשב")');
    this.resultText = page.locator('.result-text'); // ודא שזהו ה-ID או הסלקטור הנכון לתוצאת המס
  }
  
  abstract  PeriodClick():void;

  async Run(ammmount: number, points: number):Promise<string> {
    this.Navigate();
    this.enterIncome(ammmount)
    this.enterCreditPoints(points);

    // Absctract call to the child class to click on the radio button
    this.PeriodClick()

    this.clickCalculate();
    const result = await this.getResult();

    return result;

  }
  async Navigate() {
    await this.Page.goto('https://secapp.taxes.gov.il/srsimulatorNZ/#/simulatorMasHachnasah');
  }

  async enterIncome(amount: number) {
    await this.incomeInput.fill(amount.toString());
  }

  async enterCreditPoints(points: number) {
    await this.creditPointsInput.fill(points.toString());
  }

  async clickCalculate() {
    await this.calculateButton.click();
  }

  async getResult(): Promise<string> {
    return await this.resultText.innerText();
  }

  getRandomIncome(isMonthly: boolean): number {
    return isMonthly ? Math.floor(Math.random() * 20000) + 10000 : Math.floor(Math.random() * 300000) + 100000;
  }

  getRandomCreditPoints(): number {
    return parseFloat((Math.random() * 4).toFixed(2));
  }
}

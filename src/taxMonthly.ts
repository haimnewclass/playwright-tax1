import { Page, Locator, expect } from '@playwright/test';
import { BaseTaxCalculatorTest } from './baseTaxCalculatorTest';
import { test } from '@playwright/test';

class MonthCalculatorTest extends BaseTaxCalculatorTest {
   readonly MonthlyRadio: Locator;
  constructor(page: Page) {
    super(page);

    this.MonthlyRadio = this.Page.locator('#monthly******');
  }

  override  PeriodClick():void {
    this.MonthlyRadio.click();
  }
  
}


class AnnoualCalculatorTest extends BaseTaxCalculatorTest {
    readonly AnnoualRadio: Locator;
   constructor(page: Page) {
     super(page);
 
     this.AnnoualRadio = this.Page.locator('#annualy******');
   }
 
   override  PeriodClick():void {
    this.AnnoualRadio.click();
  }
  
   
 }

 
 t1:AnnoualCalculatorTest = new AnnoualCalculatorTest(this.Page);
 t1.Run();
 t2:MonthCalculatorTest = new MonthCalculatorTest(this.Page);

 // array 
t2.Run(12,12).then((result:string ) => {
    console.log(`Monthly Tax Result: ${result}`);
});



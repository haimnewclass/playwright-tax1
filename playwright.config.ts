import { defineConfig } from '@playwright/test'; 

 

export default defineConfig({ 

  testDir: './src', // Directory containing your tests 

  timeout: 30000, // Timeout for each test in milliseconds 

  retries: 1, // Number of retries for failed tests 

  use: { 

    headless: true, // Run tests in headless mode 

    viewport: { width: 1280, height: 720 }, // Default viewport size 

    ignoreHTTPSErrors: true, // Ignore HTTPS errors 

    video: 'on-first-retry', // Record video on first retry 

  }, 

  reporter: [['html', { open: 'never' }]],  

  //open: 'never' - לא ייפתח אוטומטית לאחר הרצה. 

  //open: 'on-failure' - ייפתח רק אם יש כישלון. 

  //open: 'on-first-retry' - ייפתח רק אם יש כישלון בהפעלה הראשונה. 

  //open: 'always' - ייפתח אוטומטית לאחר כל הרצה. 

   

  projects: [ 

    { 

      name: 'chromium', 

      use: { browserName: 'chromium' }, 

    }, 

    { 

      name: 'firefox', 

      use: { browserName: 'firefox' }, 

    }, 

    { 

      name: 'webkit', 

      use: { browserName: 'webkit' }, 

    }, 

  ], 

}); 

 
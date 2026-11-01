import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'./tests', timeout:30000, fullyParallel:true, workers:2,
 reporter:[['list'],['html',{open:'never'}],['json',{outputFile:'test-results/results.json'}]],
 use:{baseURL:process.env.USE_STATIC_FIXTURE?'https://homepage.test':process.env.PLAYWRIGHT_BASE_URL||'http://localhost:3000',browserName:'chromium',headless:true,launchOptions:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:undefined,trace:'retain-on-failure',screenshot:'only-on-failure'},
 webServer:process.env.USE_STATIC_FIXTURE||process.env.PLAYWRIGHT_BASE_URL?undefined:{command:'npm run preview',url:'http://localhost:3000',reuseExistingServer:!process.env.CI,timeout:30000},
});

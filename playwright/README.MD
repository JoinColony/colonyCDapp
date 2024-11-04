# Playwright Testing

This folder contains Playwright tests for the application.
For more details on Playwright, you can visit the [Playwright documentation](https://playwright.dev/).

## Installation (only before the first test run)

To install the necessary dependencies for Playwright, run the following command:

```bash
npm run e2e:install
```

Setup and start your local dev environment following the root readme.md file instrutions (all BE services should be up and running).

```bash
npm run dev
```
Seed the test data

```bash
node scripts/create-data.js
```

## Running the Tests

To execute the Playwright tests, use one of the following commands:

Run all tests:

```bash
npm run e2e
```

This will run all Playwright tests in the headless mode.

Run tests in watch mode:

```bash
npm run e2e:ui
```

This will launch Playwright's UI for running tests interactively, allowing you to watch and debug them in real time.

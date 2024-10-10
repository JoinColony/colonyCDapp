# Playwright Testing

This folder contains Playwright tests for the application.
For more details on Playwright, you can visit the [Playwright documentation](https://playwright.dev/).

## Installation (only before the first test run)

To install the necessary dependencies for Playwright, run the following command:

```bash
npm run playwright:install
```

## Running the Tests

To execute the Playwright tests, use one of the following commands:

Run all tests:

```bash
npm run playwright:run
```

This will run all Playwright tests in the headless mode.

Run tests in watch mode:

```bash
npm run playwright:watch
```

This will launch Playwright's UI for running tests interactively, allowing you to watch and debug them in real time.

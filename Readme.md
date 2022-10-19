# Colony CDapp

A interation of the Colony Dapp sporting both a fully decentralized operating mode, as well as a mode enhanced by a metadata caching layer

## Prerequisites
* `node` `v16.16.x` (Best use [nvm](https://github.com/nvm-sh/nvm))
* `npm` `v8.11.x` _(At least. The newer, the better)_
* `docker` `v19.03.0+` (See [install instructions](https://docs.docker.com/engine/install/))

## Installation

First, clone this repository :)

### Install packages

Pick the right node version (as seen in `.nvmrc`):

```bash
nvm use
```

Install all dependencies:

```bash
npm install
```

_Note: at the end of the install there's a post-install script that will recursively install dependencies for all the currently declared lambda functions_

## Running the dev environment

```bash
npm run dev
```

This will build your local docker images, then attempt to start them _(the local dev environment runs inside a couple of docker containers).

On the next start, assuming no key cache files changed, it will skip the image building step _(as it will just used the cached version)_, and go strait to starting your environment

## Running the dev web server

Once the above dev environment is up and running, you need to start your dev web server, running through webpack:
```bash
npm run webpack
```

You can access it at `http://localhost:9091` _(notice the different port, as to not cause a local storage and cache conflict with the Dapp)_

## Additional services

### Amplify

You can access the Amplify / Mock Appsync GraphQL api playground at `http://localhost:20002`

### Reputation Monitor

In order for reputation to function within your dev environment, you will need to toggle it on first.

Access the following URL to toggle the reputation monitor auto-mining on or off: `http://127.0.01:3001/reputation/monitor/toggle`

You can also view the status of the reputation monitor using the following URL: `http://127.0.01:3001/reputation/monitor/status`

### Truffle

If needed, the truffle console is available to you via:
```bash
npm run truffle console
```

_NOTE: This only works while the environment is running_

## Building the bundle locally

If you want to build the bundle locally for inspection, you can do it via:
```bash
npm run webpack:build
````

_Note: It's a straight-up dev build. Just bundled, no code optimizations whatsoever._

## Linting

Linting your code via `eslint` can be done as such:
```bash
npm run lint
```

To lint the project's style sheets you run:
```bash
npm run stylelint
```

## Type checking

Type checking using TypeScript can be accessed using this npm script:
```bash
npm run typecheck

# Or, with file watching (or any other `tsc optional arguments`)
npm run typecheck --watch
```

## Testing

To run unit tests you have the following npm script:

```bash
npm run test
```

Twemoji graphics made by Twitter and other contributors, licensed under CC-BY 4.0: https://creativecommons.org/licenses/by/4.0/

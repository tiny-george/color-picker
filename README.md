# @magnolia-private/warp-extensions-color-picker

Color picker extension for Warp.

## Get started

### Setup HTTPS

We want to run the application with HTTPS/SSL on a custom domain.

You already set up a self-signed certificate for [fex-playground](https://bitbucket.org/magnolia2022/fex-playground/src/main/)? Copy the files in a `.cert` folder at the root of this repository and you're done!

### Install dependencies

Then, install dependencies by running the following:

```bash
pnpm install
```

If you don't have `node`, see [nvm](https://github.com/nvm-sh/nvm).

If you don't have `pnpm`, simply run `npm install -g pnpm`. PNPM is an alternative package manager that is generally faster, has a reduced disk footprint and more importantly includes tools to allow multiple packages and apps within the same project ([read more](https://pnpm.io/motivation)).

### Run the application

Run `pnpm dev` to work locally or `pnpm build && pnpm preview` to preview the application in production mode.

The application will start at https://local.de.magnolia-cloud.com:3100.

## Deployement

After running `pnpm build`, the app files can be found under the `dist/` directory:

```
$ pnpm build
> tsc && vite build

vite v4.4.5 building for production...
✓ 12 modules transformed.
dist/index.html                  0.46 kB │ gzip:  0.30 kB
dist/assets/index-7805597a.css   0.70 kB │ gzip:  0.43 kB
dist/assets/index-e2b5e771.js   33.13 kB │ gzip: 12.82 kB
✓ built in 188ms
```

These files can be deployed as a static app in a S3 bucket or similar, it is self-contained and has no other dependency.

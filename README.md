# TRS - time registration system

It is new attempt to rewrite and refactor of the TRS app _previous version can be found here_(<https://github.com/rogreyroom/trs-app>)
The main goal is to create the app with the use of typescript and test it with Jest, supertest and testing-library.

## Application 🚀

Application screenshots for now in the original release: <https://github.com/rogreyroom/trs-app>

## Usage

### Create an App

```bash

# with yarn
$ yarn create nextron-app trs --example with-typescript

```

### Install Dependencies

```bash
$ cd trs

# using yarn
$ yarn

```

### Install eslint and prettier width airbnb configuration

```bash
# with yarn
$ yarn add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
$ yarn add -D eslint-config-airbnb eslint-plugin-import eslint-plugin-react eslint-plugin-jsx-a11y eslint-import-resolver-alias eslint-plugin-react-hooks
$ yarn add -D prettier eslint-plugin-prettier eslint-config-prettier

#using yarn
$ yarn lint
$ yarn lint:fix
$ yarn format

```

### Install jest and react testing library

```bash
# with yarn
$ yarn add -D @testing-library/react @testing-library/jest-dom jest ts-jest @types/jest @types/testing-library__react @types/testing-library__jest-dom

#using yarn
$ yarn test
$ yarn test:watch
$ yarn test:coverage

```

### Install express server, NEDB, Joi and supertest

```bash
# with yarn
$ yarn add express helmet morgan cors nedb-async
$ yarn add -D supertest joi ts-node @types/joi @types/node @types/express @types/morgan @types/supertest

```

### Use it

```
# development mode
$ yarn dev

# production build
$ yarn build
```

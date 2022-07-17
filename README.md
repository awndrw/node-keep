# node-keep <img width="16" height="16" src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg">

![npm dev dependency version](https://img.shields.io/npm/dependency-version/node-keep/dev/typescript)
![coverage](./lib/badges/badge-lines.svg)

# Install

```sh
npm install node-keep
# or
yarn add node-keep
```

# Usage

[See full API docs](#api)

```ts
const keep = new Keep();
// Node Keep must be initialized before it is used
await keep.init();

//
keep.setItem('keyOne', 'valueOne');
```

# API

| Method                          | Description                                                                                   |
| ------------------------------- | --------------------------------------------------------------------------------------------- |
| [constructor](#constructor)     | Constructs a new instance of the <code>Keep</code> class                                      |
| [init()](#init)                 | Initializes the storage directory.<br/>**Note**: This must be called before any other methods |
| [setItem(key, value)](#setitem) | Stores (or updates) a key-value pair in the storage directory.                                |
| [getItem(key)](#getitem)        | Retrieves the value of the specified key or undefined if the key is not found.                |
| [removeItem(key)](#removeitem)  | Removes a key-value pair from the storage directory.                                          |
| [data()](#data)                 | Returns the data stored in the storage directory.                                             |
| [keys()](#keys)                 | Returns the keys of the data stored in the storage directory.                                 |
| [values()](#values)             | Returns the values of the data stored in the storage directory.                               |
| [length()](#length)             | Returns the number of key-value pairs in the storage directory.                               |
| [clear()](#clear)               | Removes all key-value pairs from the storage directory.                                       |

### Constructor

```ts
constructor(config?: Partial<Config>);
```

See [`Config`](#config)

## `Config`

```ts
export interface Config {
	/**
	 * The directory to store the data in.
	 * @defaultValue ".keep/storage"
	 */
	dir: string;

	/**
	 * A function to log errors to (or false to disable).
	 * @defaultValue console.log
	 */
	log: ((...args: any[]) => void) | false;
}
```

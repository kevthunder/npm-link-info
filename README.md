# npm-link-info

Get info about linked modules

## Installation

Install package with NPM :
```sh
npm install npm-link-info
```

You can install it directly from github:
```sh
npm install kevthunder/npm-link-info
```

## methods

### getLinked
get all the modules that were linked

#### Parameters
- `packageFile` (String) starting package.json, default to the package.json in PWD
- `baseFolder` (String) base forder for the current module, default to the disname of `packageFile`
- `checkDev` (Boolean) Whenever to check dev dependency or not, default to `true`

Returns array of module names

### isLinked
check if a module is linked

#### Parameters
- `depedency` (String) name of the module to test
- `baseFolder` (String) base forder for the current module, default to PWD

Returns a boolean
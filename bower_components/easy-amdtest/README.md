easy-amdtest [![Build Status](https://travis-ci.org/easy-js/easy-amdtest.png)](https://travis-ci.org/easy-js/easy-amdtest)
============

The purpose of this library is to streamline the process of testing, locally and in the cloud, by abstracting away the majority of the required boiler code.

**Supported Frameworks:**

* Mocha

**Supported Platforms:**

* SauceLabs

---

## Example

```
<script src="../bower_components/requirejs/require.js"></script>
<script src="../dist/easy-amdtest.js"></script>
<script>
  var testSuite = new EasyAMDTest({
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
      'proclaim' : '/node_modules/proclaim/lib/proclaim',
      'mocha'    : '/node_modules/mocha/mocha'
    }
  }).run({
    name: 'mocha',
    tests: ['./easy-amdtest-mocha.js']
  });
</script>
```

---

## Install

```
$ npm install easy-amdtest`
```

```
bower install easy-amdtest
```

---

## API

### EasyAMDTest(configuration)

Class for quickly and easily testing AMD modules.

##### PARAMETERS:

* **\*configuration**: Object -- Requirejs configuration object.

##### RETURNS:

EasyAMDTest instance.

##### EXAMPLE USAGE:

```
var tests = new EasyAMDTest({
  baseUrl: '../src',
  paths: {
    'underscore': '/bower_components/underscore/underscore'
  }
});
```

### EasyAMDTest.run(options)

Run your test suite.

##### PARAMETERS:

* **\*options**: Object
  * **\*name**: String - Name of the test [framework](#frameworks) to use.
  * **\*opts**: Object - Options for the given [framework](#frameworks).

##### EXAMPLE USAGE:

```
new EasyAMDTest(requireConfig).run({
  name: 'mocha',
  opts: {
    style: 'bdd'
  }
});
```

---

## Frameworks

### Mocha

#### Name

`mocha`

#### Options

**style**: String -- `bdd` or `tdd` 
  

---

## TESTS

### Local

**Install Dependencies**

```
npm install
```

```
bower install
```

**Run/View**

```
grunt test-local
```

---

## License

The MIT License (MIT) Copyright (c) 2014 First Opinion

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
endpoints.js [![Build Status](https://travis-ci.org/firstopinion/endpoints.js.png)](https://travis-ci.org/firstopinion/endpoints.js)
============

Module for creating browser based api clients.

* Normalizes interface for passing data to various methods (GET, POST, DEL)
* Provides global default opts for api calls.
* Easy integration with Backbone

---


Dependencies
------------

* jquery

---


Installation
------------

`bower install endpoints.js`

`npm install endpoints.js`

---


Usage Example
-------------

Use HTTP Auth for initial authorization and token for subsequent calls.

### Create Resources

```
var user = {
  // Define resource endpoint
  login: {
    path: '/LOGIN/PATH',
    type: 'POST',
    before: function (opts) {
      // We authorize using HTTP
      opts.headers = opts.headers || {};
      opts.headers['Authorization'] = 'Basic ' + window.btoa(opts.username + ':' + opts.password);
    }
  }
};
```


### Initialize API


```
var api = new Endpoints({
  // Authorization credentials
  authorization: {
    username: 'USERNAME',
    password: 'PASSWORD',
    endpoint: user.login
  },

  // Default opts for all calls
  defaults: {
    url: 'BASEURL',
    dataType : 'json',
    headers: {
      'Accept': 'application/json;version=' + env.apiVer,
      'Content-Type': 'application/json',
    }
  },

  // Individual resources
  resources: {
    user: user
  }
});
```

### Authorize


```
api.authorize({
  success: function (data) {
    api.set('defaults.headers.Authorization', 'Bearer ' + data.access_token);
  }
})
```

---


License
-------

The MIT License (MIT) Copyright (c) 2013 First Opinion

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
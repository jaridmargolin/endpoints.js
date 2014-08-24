/*!
 * test/fixtures/resources.js
 * 
 * Copyright (c) 2014
 */

define(function () {


/* -----------------------------------------------------------------------------
 * resources
 * ---------------------------------------------------------------------------*/

return {
  "/endpoint": {
    "options": {
      "POST": {
        "authorization": "Bearer",
        "headers": {
          "Accept": "application/json;version=v1",
          "Content-Type": "application/json"
        },
        "params": {
          "foo": true,
          "bar": false
        }
      }
    }
  }
};


});
<h3>Different Ways to Add Pepper in Hashing: </h3>

1. test1.js - 

uses hash($pepper.hash($salt.$password))

2. test2.js - 

uses hash(hash($pepper.$salt).$password))

3. test3.js - 

uses hash(hash($pepper).hash($salt.$password))

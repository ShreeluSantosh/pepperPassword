test1.js - 

uses hash($pepper.hash($salt.$password))

test2.js - 

uses hash($pepper).(hash($salt.$password))

test3.js - 

uses hash(hash($pepper).(hash($salt.$password)))

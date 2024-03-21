<h3>Proposed Way to Add Pepper in Hashing: </h3>

test3.js - 

Hashed_password = hash(hash($pepper).hash($salt.$password))

# pepperPassword

This is a work-in-progress salting and peppering approach to securing passwords against birthday attacks. The following approach is being explored:

<ul>
  <li>Experimenting with storing pepper in various secure locations outside of database and application code</li>
  <li>Trying out various ways to hash pepper with the password</li>
  <li>Implementing a pepper rotation scheme, without having to go over the tedious task of having to rehash everyone's passwords in one go</li>
</ul>

Tech Stack:

<ul>
  <li>MongoDB</li>
  <li>Node.js</li>
</ul>

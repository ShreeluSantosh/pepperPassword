# pepperPassword

This is a work-in-progress salting and peppering approach to securing passwords against birthday attacks. 

The following approach is being explored:

<ul>
  <li>Experimenting with storing pepper in various secure locations outside of database and application code. Possible ideas include USB drive, Hardware Security Module and much more.</li>
  <li>Implementing a pepper rotation scheme, without having to go over the tedious task of having to ask the user to use a new password, or rehash everyone's passwords in one go. The rotation is proposed to take place every 90 days.</li>
</ul>

<h2>Table of Contents:</h2>

<ul>
  <li><a href="#techstack">Tech Stack</a></li>
  <li><a href="#hash">Hashing Pepper into Password Hash</a></li>
  <li><a href="#rotation">Pepper Rotation Scheme</a></li>
  <li><a href="#screenshots">Screenshots from Work</a></li>
</ul>

<hr>

<h3 id="techstack">Tech Stack:</h3>

<ul>
  <li>MongoDB</li>
  <li>Express.js</li>
  <li>Node.js</li>
  <li>Streamlit</li>
  <li>Cryptography</li>
  <ol>
    <li>Hashing</li>
    <li>Libraries: crypto Node.js dependency</li>
  </ol>
</ul>

<h3 id="hash">Proposed way to hash pepper with the salt and password:</h3>

```Hashed_password = hash(hash($pepper).hash($salt.$password))```

<h3 id="rotation">Pepper Rotation Scheme</h3>

Most password policies specify that passwords need to be changed every 30, 60, or 90 days. This can be tedious for the following reasons:

<ol>
  <li>Difficult for users to remember and commit the new password to memory</li>
  <li>Can slow down the operations of the organization or systems.</li>
</ol>

So, reminding the user to provide new password at the end of every window is not effective. Thus, we need a new way to make sure the hashed passwords updated regularly.

One way to keep the password database updated is to rehash everyone's passwords with new pepper value. But hashing is one-way function, and this means that we cannot get password from the hashes stored in the database. This measn that there is only one way to get passwords for rehashing - taking the user input password.

We can utilize this by setting a timer for pepper value to change. Every time the timer is up, the pepper value is updated. From there, we can simply take input password, and rehash it using the salt already stored in the database, along with the new pepper value. Then the new hashed password is stored in place of old hash in the database.

The proposed approach to pepper rotation scheme is:

<ol>
  <li>Set timer to desired value (say, 90 days).</li>
  <li>Each time the timer is up, the pepper is updated with new value.</li>
  <li>Then, each time a user logs in, the last password update date (or account signup date for new users) is checked.</li>
  <li>If the password update date is before the pepper update date, then, after verifying the input password, the password is rehashed with stored salt and new pepper.</li>
  <li>The rehashed password is stored in the database, along with the new password upate date.</li>
</ol>

<h3 id="screenshots">Screenshots from the work:</h3>

![image](https://github.com/ShreeluSantosh/pepperPassword/assets/94289402/d5e60d62-334f-4943-865b-2e8eacb860d2)

![image](https://github.com/ShreeluSantosh/pepperPassword/assets/94289402/f5ffa2a7-8832-4221-8d3d-5528fdde3266)

![image](https://github.com/ShreeluSantosh/pepperPassword/assets/94289402/e66181a3-a204-4adf-b982-b884e2982a86)

![image](https://github.com/ShreeluSantosh/pepperPassword/assets/94289402/ee921ee3-d65b-4857-afc4-f94f40777e36)

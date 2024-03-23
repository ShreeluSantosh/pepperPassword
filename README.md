# pepperPassword

This is a work-in-progress salting and peppering approach to securing passwords against birthday attacks. 

The following approach is being explored:

<ul>
  <li>Experimenting with storing pepper in various secure locations outside of database and application code</li>
  <li>Implementing a pepper rotation scheme, without having to go over the tedious task of having to ask the user to use a new password, or rehash everyone's passwords in one go. The rotation is proposed to take place every 90 days.</li>
</ul>

Tech Stack:

<ul>
  <li>MongoDB</li>
  <li>Express.js</li>
  <li>Node.js</li>
  <li>Streamlit</li>
</ul>

Proposed way to hash pepper with the salt and password:

```Hashed_password = hash(hash($pepper).hash($salt.$password))```

Screenshots from the work:

![image](https://github.com/ShreeluSantosh/pepperPassword/assets/94289402/eb890ec3-3262-4bdd-b0fc-ea6ae86151af)

![image](https://github.com/ShreeluSantosh/pepperPassword/assets/94289402/b27ce45e-a082-47f1-9748-fdde58864a37)

![image](https://github.com/ShreeluSantosh/pepperPassword/assets/94289402/b66c35ad-3f05-4589-95f8-250ed82279a1)

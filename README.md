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
  <li>Streamlit</li>
</ul>

Screenshots from the work:

![image](https://github.com/ShreeluSantosh/pepperPassword/assets/94289402/eb890ec3-3262-4bdd-b0fc-ea6ae86151af)

![image](https://github.com/ShreeluSantosh/pepperPassword/assets/94289402/b27ce45e-a082-47f1-9748-fdde58864a37)

![image](https://github.com/ShreeluSantosh/pepperPassword/assets/94289402/b66c35ad-3f05-4589-95f8-250ed82279a1)

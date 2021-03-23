OBLIG 3 fullstack  - 24.03.21

POSTMAN SETUP

1. Import the postman collection provided. its named : oblig3.postman_collection.json

	REQUESTS

2. The signup request takes in 7 query parameters that are all required. Response is the user object that you signed up

3. the login request takes in a email and a password query parameter.
   If the login credentials exist in the db you will get a token else a error msg saying that user is not found
   Response is a token that you need to copy and use in other requests

4. user profile request takes in a secret_token query parameter. 
   If the token exists then get user info that has that token else it will not get authorized.
   Response is msg saying that you are in the secret place, user object and the token used

5. Forgot password request needs 3 query parameters. email, secretQuestion and newPassword. Email is for choosing which user 
   you want to find the password to, secretQuestion is like the real wordl example of secret questions when you first sign up. example: 
   when you register a account you often get to create a secret question like this "where were you born".  If the question is answered right
   then you will get the ability to change the password. the password changed is the newPassword query parameter
   Response is a message telling you what your new password is and for which user. also shows user info. (password gets hashed)

6. Authenticated read others request expects a token and a name. token to get authorized and name is the user you want to find.
   if token is not valid then you will not get authorized. else if the name looking for does not exist then it will show a empty array.
   If the name query parameter is omitted altogheter, it will show all users in the db.
   Response is msg saying here are the users, all users matching the query and the token used.
   In this example both the password and secretquestion is visible, but for academic and easier handling purposes i left those be visible
   to all users who look up other users.

7. Authenticated delete others request needs a token and a email. token to get authorized and email is the user you want to find and delete.
   if token is not valid then you will not get authorized. else if the email looking for does not exist then it will show a empty array.
   if email parameter is not present you will get a warning saying that you need to enter a email.
   Response is msg showing the name and email of the user deleted, all the user info of the deleted user and the token used.

8. Authenticated update user request needs a secret_token and email query parameters. token to get authorized and email to choose
   who you want to update. Also you need to add information in the body as JSON. Here is a boilerplate for that:
   { "surname":"sword" , "role":"student", "place":"on-campus", "status":"busy"}. You dont need to update all of them. 
   Response is msg showing the user updated and a confirmation msg+ token used to get auth

MONGO-DB COMPASS SETUP

1. open mongodb compass and insert this url: mongodb://localhost:27017/users-db

2. enter users db and then again users

3. import the user.json file that is in this folder. the passwords will get hashed if you sign up using the code, but since
   you are importing json data they will show as is.

4. thats it! I have made your life easier, just like you wanted ;)



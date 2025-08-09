Run react app:
==============
1. Clone the project folder
2. cd/ecommerce
2. npm install --> for windows / sudo npm install --> mac
3. npm start --> for windows / sudo npm start --> mac
4. http://localhost:3000/
5. Navigate to "Product Catalog" tab
6. start search:
   1. search by name: "apples"
   2. above rating 4
   3. below rating 3
   4. below price 80
   5. above price 100
   6. fruits / dairy / bakery / eggs / seafood / meat / pantry / vegetables
   


Run server app:
===============
1. cd/ecommerce/api
2. npm install --> for windows / sudo npm install --> mac
3. ecommerce/api/.env --> update "OPENAI_API_KEY" secret key, follow below steps
   1. Create openai key & update here:
   2. https://platform.openai.com/ 
   3. API keys (tab)
   4. Create new secret key
   5. Copy key
   6. paste here 'key start with sk'
3. node server.js --> for windows / sudo node server.js --> mac
4. http://localhost:4000/ 


Which AI feature you choose:
============================
Option A – Smart Product Search (NLP)



Tools/libraries used:
=====================
1. react app 
   1. axios
2. server app 
   1. cors
   2. dotenv
   3. express
   4. openai


Any notable assumptions:
=======================
OpenAI API keys are restricted to push GitHub and other public code hosts


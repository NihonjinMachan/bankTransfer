# Bank boostrap

#npm modules used:
    1- express: Routing 
    2- body-parser: Parsing POST request data
    3- mysql2: MySQL dB connectivity

#external software used:
    1- XAMPP: Local MySQL dB
    2- Postman: Multiple request testing
    3- Google Chrome: Single client testing
    4- PHPMyAdmin: Visual representation of dB
    5- VS Code: Text editor

#SQL file explanation (database.sql):
    - Any pre-existing 'Balances' and 'Transactions' tables are dropped before new ones are created. This is done
    to remove duplicate data.

    - The tables are created as per the requirements without any changes.

    - Fields:
        * Balances: accountNr [(char), (primary key)] ; balance (int)
        * Transactions: reference [(int), (primary key), (auto increment)] ; amount (int) ; accountNr (char)

    - The accountNr field in the Transactions table is a foreign key from Balances.
    Although it is not queried in this specific exercise, one possible use case for the foriegn key would be
    "Retrieve the sum of all the transactions made by accountNr X".

    - Three accounts have been inserted into the Balances table for testing purposes.

    - MySQL engine used is INNODB.

#Custom module details:
#dbConnect.js:
    - dbConnect is the external module that helps in connecting to the MySQL dB.

    - It establishes a connection using a connection pool.

    - A connection pool was used since it is more efficient performance-wise compared to normal connections.

    - Since the project was run on a MySQL server locally, the root account was used for convenience. But, 
    it would be recommended to create a new account with a password for security reasons.

    - Finally, the connection is exported as an object to be used by other modules.

#validate.js:
    - validate module is used to ensure the data entered by the user is valid by performing a few tests. 
    It exports a function that takes in a request body payload, dB connection and callback function as
    parameters.

    - First, it checks if the required fields (sender, receiver, amount) are present in the POST request
    body.

    - Note: It is assumed that accountNr is a string of length 8 and has the pattern "2 uppercase letters
    followed by 6 numbers (AA######)"

    - The next couple of tests are used to check if the account numbers passed comply with the above 
    mentioned requirements. 

    - Finally, the account numbers are checked to see if they are present in the dB. If they are valid, 
    the next test compares the amount the sender is trying to transfer with their account balance.
    If the transfer amount is greater than the account balance, an error is raised. Else, the transaction
    takes place.

    - For added security, a white list of all the required fields is also created after the validation 
    process to remove any junk data if present. (Not part of validate.js; code in index.js)  

#transaction.js:
    - transaction module is used to perform transfer transactions. It exports a function that takes in 
    a request body payload, dB connection and callback function as parameters.

    - MySQL transaction was used to perform the transfer queries since they maintain ACID properties 
    and is a good mechanism for concurrent systems.

    - If queries fail, the transaction rolls back to the last stable state. Furthemore, all writes to 
    the dB should pass a commit before they are finalized. This ensures data is consistent.

    - MySQL transactions also lock rows that are being written to so it prevents race conditions from 
    occuring.  

#response.js:
    - The final piece of the program, the response module queries for the latest transaction reference ID as
    well as the current balance in the sender's and receiver's accounts. It generates and returns a response
    object with the queried fields. It exports a function that takes in a request body payload, dB connection 
    and callback function as parameters. 

    - Since MySQL commands in Node.js run asynchronously, the counter variable is used to check if all three 
    SELECT queries are complete before returning the response object.   

#Main program (index.js):
    - index.js is the main backbone program that establishes the express routes as well calls the 
    external modules in the right order.

    - The final output of the main program is the response object mentioned in the requirments spec.

#Testing:
    - All of the testing was done on the browser as well as Postman. Therefore, no test code was 
    written in the 'test' folder.

    - The browser was used for single client testing. All the test cases (invalid pattern, insufficient funds 
    etc) were checked. As expected, errors were raised when invalid data was entered and transactions occured 
    otherwise. Hence, validate.js was performing accurately. Furthermore, the new balances were of the expected
    value after the transaction was complete. 

    - Postman was used to send multiple concurrent requests. Two instances of Postman Runner were opened,
    each sending 20 requests at a 1 second delay. The program produced expected results and performed 
    without hiccups.
    The use cases provided in the requirements spec:
        1- High concurrency
        2- Account A and Account C sending money to Account B at the same time
    were tested and the results provided were accurate.

#Additional notes:
    - Since I am not knowledgeable in Docker, the docker-compose.yml was not used for this project.

    - The request and response objects were not changed structurally and are as per the requirements 
    spec. But, the names of some fields were changed to suit personal preference.

    - There was another use case mentioned wherein the database crashes during transfers. Since 
    MySQL tansactions are used, rollbacks are preformed and the data is kept secure and consistent.
    Now that the data is secure, the next thing to do is to generate a front-end "Error" page 
    informing the user of technical difficulties or move to a backup database. 



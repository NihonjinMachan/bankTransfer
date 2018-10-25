# Transactions at the bank

## Context 

You are working at a bank and are tasked to rewrite some
of their APIs. 

In particular, you will now need to write
the **method** that transfers money between 2 accounts.

## Structure

The bank employs this DB structure:

```
TABLE transactions
  - reference (unique)
  - amount
  - account nr
```
The **Transactions** table registers any transaction in an account
(ie. today I paid 20$ for a movie with my credit card).

```
TABLE balances
  - account nr (unique)
  - balance
```

The **Balances** table represents the account balance of customers
(ie. I have $5k in my bank account).

The bank uses a **MySQL DB** to store these info. 
and you are tasked to port the **transfer API method** from an old
framework to **NodeJS**. Here's where you should focus your attention. 

``` js
app.post('/transfer', (req, res) => {
  // here starts the fun
})
```


## Requirements (Important)

- Implement the **/transfer** API which transfers X amount of money from account A to account B.
- The request should be a `POST` request to the method **/transfer** with the payload: `{from:account, to:account, amount:money}`.
- The response should return the following payload: `{id:transaction_id, from:{id:account, balance:current_balance},to:{id:account,balance:current_balance}, transfered:transfer_amount}`
- You can change the request or the response payloads but, please, specify the reasons inside the `README.md` file.
- Remember that you are working at a bank, so you need to make sure the request and the data you save are always valid and consistent.
- Your app must be secure.
- You don't need to care about user authentication or authorization.
- Prevent that one customer might tap on the "pay/transfer" button twice by accident.
- Do not use an ORM just the mysql library added.

## Considerations (Read carefully)

- Focus your attention on the whole integrity of the system, consistency and security as we are talking about a banking app. 
- Please think about all the different use cases:
    - What happens under high concurrency?
    - What happens if your database becomes unavailable in the middle of your logic?
    - What happens if 2 users (A, B) transfer money to user C at the same time?
    - And so forth.
- How do you handle and structure the errors that you return to the client?
- Try to make use of ES6 specification if is possible. 
- And remember, less is more.

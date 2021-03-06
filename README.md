# Backend Developer Challenge

## Project description

**Pizzeria**

The application serves the purpose of ordering pizza online.

The following entities should be created (including proper relations):

- _pizza type_ - has a name and price (e.g. Margherita $5, Pepperoni $6, ...)
- _order_ - has items
- _order item_ - has a pizza type and quantity

On the homepage, list of orders with total prices should be shown.

On a "Create Order" screen, the user can select pizza types and amounts, add to the order, see current total, and place (save) the order.

Additionally, the following JSON API should be provided:

- list of orders
- details of an individual order

Optional features:

- meaningful model validations (e.g. item amount > 0)
- order bonuses (e.g. 5% cheaper when total over \$50, 10% cheaper when total over ...)
- authentication
- tests
- whatever interesting you'd like to do

## Evaluation

Our goal is to find answers to those questions:

- Do you understand the chosen stack, framework, and MVC pattern in general?
- Can you design interfaces that are clear and easy to use?
- Do you master your working environment?

Due to the limited time consider the following:

- It is not important to have a fully functional application at the end
- The goals might shift during the interview as we discuss the work flow
- The front-end does not have to be beautiful

Levels of functionality:

- **basic** - items mentioned in description work
- **above average** - some optional features
- **exceptional** - getting tests to continuously build, deploy to heroku, etc.

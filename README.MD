 ## Gang of Four Book Ecommerce 🚀

<div >
<img width="400px" height="400px" src="https://res.cloudinary.com/codingwithvudang/image/upload/v1622117732/logo_hcbfie.png" >


## 🚀 Get Started

```bash
# install expo cli
npm install -g expo-cli
```
``` bash
# install dependencies
npm install
```
Or use `yarn`
``` bash
yarn install
```
``` bash

# run project
expo start
```
``` bash
Change the API in config.ts to the server that you're running. 
```
## 🚀 Gang of Four Design Patterns
Design Patterns: Elements of Reusable Object-Oriented Software is a book on software engineering highlighting the capabilities and pitfalls of object-oriented programming. They have listed down 23 classic software design patterns which are influential even in the current software development environment. The authors are often referred to as the Gang of Four (GoF).

1. Creational Patterns
  - Singleton
  - Factory
  - Abstract Factory
  - Builder
  - Prototype
2. Structural Patterns
  - Adapter
  - Composite
  - Proxy
  - Flyweight
  - Facade
  - Bridge
  - Decorator
3. Behavioral Patterns
  - Template Method
  - Mediator
  - Chain of Responsibility
  - Observer
  - Strategy
  - Command
  - State
  - Visitor
  - Iterator
  - Interpreter
  - Memento

The project applys these patterns :  
  - [X] Singleton : In core/Singleton
  - [X] Factory : In core/Factory
  - [X] Template Method : In core/TemplateComposition 
  - [X] Composition : In core/TemplateComposition 
  - [X] Iterator : In core/Iterator
  - [X] Proxy: In core/Proxy
  - [X] Strategy : In core/Strategy
  - [X] Command : In core/Command

 The libraries/frameworks apply GOF patterns:
  - [X] Chain of Responsibility : Using Redux for state management
  - [X] State : Dispatch -> Update new state
  - [X] Composition: React Native follow React's strategy 
  In React using Composition and Props gives you all the flexibility that you would need. React does not say Composition is better than Inheritance. Composition just fits better within the React’s component structure.

# Project Context

When creating and working with this codebase, prioritize readability over cleverness. Ask clarifying questions before making architectural changes. 

## About This Project

We are going to create a progressive web app, mobile first version of the classic pricing game Cover Up from the USA version of The Price is Right. Gameplay is described on priceisright.fandom.com/wiki/Cover_Up as follows (with some minor editing):

- A game board is presented with five spaces at the bottom. Digits are provided above each space-- two options for the first space, three for the second and so on up to six options for the fifth space. The contestant must choose a digit and cover up each space.
- Once all five digits have been covered, the host asks if the price given is correct. If the answer is negative as signified by a buzzer, any right digits are lit up and the contestant is directed to cover up each of the remaining incorrect digits. This sequence then repeats as necessary. The game ends when the contestant either wins by having the entire price correct or loses by having no new correct numbers in a round of guessing. Often, if it is guaranteed to be the last round, Drew will press the button to reveal the correct price to be more dramatic, except during the COVID-19 pandemic, when the contestant instead pushes it. Bob only asked if the price is right before pressing the button and for more drama, the camera cuts to the contestant before cutting back to the price, already revealed, although sometimes, all or part of the shot of the price being flipped down is seen, foreshadowing the next generation with Drew. It's possible to have a situation where a win is guaranteed if the contestant gets the fourth and fifth numbers before the second and third. Drew has the contestants play the game out in this situation. If the contestant gets four numbers right, and there's only one number left in the column, the contestant automatically wins the car.

With the web app version of this game, however, I want to use the following symbols instead of the digits zero thru nine: 🌑🌕⭐️☀️☁️💧❤️♦️♠️♣️. As the original game is for a specified car, making at least the first and second numbers somewhat predictable, I would like to simulate similar predictability with the first and second symbols. For example: Sun or Moon for the first symbol, with the correct symbol being an indicator of the local time of day. The second symbol could be a moon phase or an indicator of the local weather. Things get less predictable for digits 3, 4, and 5. Thus the correct symbols can be any of the 10 available.

## Key Directories

- `app/` - where the main app code will live
- `public/` - files to be packaged directly when compiled

## Standards

- 4 space indents
- More to be determined

## Notes

- None yet

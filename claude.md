# Project Context

When creating and working with this codebase, prioritize readability over cleverness. Ask clarifying questions before making architectural changes. 

## About This Project

We are going to create a progressive web app, mobile first version of the classic pricing game Cover Up from the USA version of The Price is Right. Gameplay is described on priceisright.fandom.com/wiki/Cover_Up as follows (with some minor editing):

- A game board is presented with five spaces at the bottom. Digits are provided above each space-- two options for the first space, three for the second and so on up to six options for the fifth space. The contestant must choose a digit and cover up each space.
- Once all five digits have been covered, the host asks if the price given is correct. If the answer is negative as signified by a buzzer, any right digits are lit up and the contestant is directed to cover up each of the remaining incorrect digits. This sequence then repeats as necessary. The game ends when the contestant either wins by having the entire price correct or loses by having no new correct numbers in a round of guessing... It's possible to have a situation where a win is guaranteed if the contestant gets the fourth and fifth numbers before the second and third. ... If the contestant gets four numbers right, and there's only one number left in the column, the contestant automatically wins the car.

With the web app version of this game, however, I want to use the following symbols instead of the digits zero thru nine: 🌑🌕⭐️☀️☁️💧❤️♦️♠️♣️. As the original game is for a specified car, making at least the first and second numbers somewhat predictable, I would like to simulate similar predictability with the first and second symbols. For example: Sun or Moon for the first symbol, with the correct symbol being an indicator of the local time of day. The second symbol could be a moon phase or an indicator of the local weather. Things get less predictable for digits 3, 4, and 5. Thus the correct symbols can be any of the 10 available.

The visual layout of the app should be similar to the Wordle game, except with the near triangular grid of options for the symbols. Something like this, though obviously options will be randomly picked and assigned for the columns, with exception of the first two as noted in the previous paragraph:

◼️◼️◼️◼️♦️
◼️◼️◼️💧❤️
◼️◼️♦️♠️♣️
◼️⭐️☀️☁️💧
☀️🌕♣️♦️♠️
🌕🌗💧⭐️☁️

For each column, there should be a correct answer selected and hidden from the player.

Style it kind of like Wordle layout wise: Visually pleasant spacing between the symbol squares, especially for a mobile screen. Beneath the grid should be visually apparent dropdown menus with the options for each column. Make them clearly buttons as to not need the traditional drop-down arrow ⌄. Their default option should be a set of five symbols not part of the ten noted above, but should fill the space well. So the interface can look something like this:

◼️◼️◼️◼️♦️
◼️◼️◼️💧❤️
◼️◼️♦️♠️♣️
◼️⭐️☀️☁️💧
☀️🌕♣️♦️♠️
🌕🌗💧⭐️☁️
☸️✝️♒️♈️☮️ but this last row is a set of buttons with drop-down menus, no side down arrow

There should be 'Check' (literal word 'Check') button available beneath the grid to see if any of the selections are correct. This should only be enabled when selections are made for all needed columns.

When the 'Check' button is pressed, the choices selected from the columns should be replaced with a blue square. For example:

◼️◼️◼️◼️♦️
◼️◼️◼️🟦❤️
◼️◼️♦️♠️♣️
◼️⭐️🟦☁️💧
🟦🌕♣️♦️♠️
🌕🟦💧⭐️🟦
☀️🌗☀️💧☁️

For the scenario when some selections are correct, when the check button is pressed, buttons should be lit up indicating correct or unlit for incorrect choices. The buttons with the correct selections should be outlined a color between cyan and baby blue. 

For the scenario where all selections are correct, outline them all green to indicate a win and the end of the game. 

For the scenario where no new selections are correct, outline them all red to indicate a loss and the end of the game. Reveal the correct answers beneath the row of buttons.

Provide a 'Restart' button beneath the check button to repopulate the grid and start a new game. This should be available always.


## Key Directories

- `app/` - where the main app code will live
- `public/` - files to be packaged directly when compiled

## Standards

- 4 space indents
- More to be determined

## Notes

- None yet

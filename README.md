*Feel free to use the code to learn and create your own versions, but don't use it for commercial purposes!*
---
# Memory Game 🎴🧠🤔
The classic memory game where you have to remember the pairs to win.

## Implemented modes
- **1 player:** Ideal if you want to relax while playing at your own pace.
- **2 players:** To play with friends using the same device.
- **1 player vs computer:** If you like challenges and want an adversary at your level to play against.
- **Online (in progress):** To play with your friends regardless of where they are.

## Technologies used
Virtually the entire game has been developed using **HTML5**, **CSS** and pure **JavaScript**.
Additionally, to create the online mode, **WebRTC** has been used.

## Design explanations
### AI player
In developing the AI adversary, the following considerations were taken into account:
- The opponent can only know where the cards that have been revealed are located.
- The opponent can't always remember where all the cards are.
That is why a system was created that stores all the cards once they are shown.

If the opponent does not know a pair in advance before his roll, he will not select it even if he has uncovered the 
one he was missing on his first roll. This is done to give the player a chance to remember the card and select it. 
However, it is possible that the opponent randomly selects the correct card.

To adjust the difficulty, a probability is used that will determine how often the opponent remembers a pairing that has seen before.

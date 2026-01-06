
const xImageURL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1083533/x.png';
const oImageURL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1083533/circle.png';

function assignSpace(box, owner) {
    //create an <img> element with x image src
    const img = document.createElement('img');
    img.src = owner=='x' ? xImageURL : oImageURL;
    
    let index = parseInt(box.id);
    takenBoxes[index] = owner;
    //append the img element to the clicked grid item
    box.appendChild(img);
    box.removeEventListener('click', playACycle);
    
    // remove the container from freeBoxes array
    index = freeBoxes.indexOf(box);
    freeBoxes.splice(index, 1);
}

function playACycle(event) {
    assignSpace(event.currentTarget, 'x');
    
    if(isGameOver()) {
        displayWinner();
    }else {
        computerChooseO();
    }
}

function computerChooseMove()
{
    // First see if o can win in the next move. If so, return the winning move
    // hint: you should use freeBoxes to try various moves and set each move for 'o' and try it.
    for( let i=0; i<freeBoxes.length; i++)
    {
        box = freeBoxes[i];
        const id = parseInt(box.id);
        takenBoxes[id] = 'o';
        if(getWinner() === 'o')
        {
            delete takenBoxes[id];
            return i;
        }
        delete takenBoxes[id];
    }
    // second, see if opponent could win on their next move, if so, make that move 
    // to block the opponent from wining
    for(let i=0; i<freeBoxes.length; i++)
    {
        box = freeBoxes[i];
        const id = parseInt(box.id);
        takenBoxes[id] = 'x';
        if(getWinner() === 'x')
        {
            delete takenBoxes[id];
            return i;
        }
        delete takenBoxes[id];
    }

    // if none of the above, then just make a random move.
    return Math.floor(Math.random() * freeBoxes.length);
}

function computerChooseO() {
    const boxIndex = computerChooseMove();
    const chosenItem = freeBoxes[boxIndex];
    assignSpace(chosenItem, 'o');
    if(isGameOver()) {
        displayWinner();
    }
}

function isGameOver() {
    //check if there is a winner or if there are no more free boxes
    return freeBoxes.length===0 || getWinner() !== null;
}   

// retur5ns 'x', if x wins, or 'o', if o wins. Otherwise return null
function getWinner()
{
    //check for row matches: row 1, row 2, row 3
    let rowResult = checkBoxes('1', '2', '3') || checkBoxes('4', '5', '6') || checkBoxes('7', '8', '9');
    //check for columns matches: col 1, col 2, col 3
    if (rowResult !== null)
        return rowResult;
    
    const colResult = checkBoxes('1', '4', '7') || checkBoxes('2', '5', '8') || checkBoxes('3', '6', '9');
    if(colResult !== null)
        return colResult;
    //check diagonals
    return checkBoxes('1', '5', '9') || checkBoxes('3', '5', '7');
    
}

function checkBoxes(first, second, third)
{
    if(takenBoxes[first] !== undefined &&
        takenBoxes[first] === takenBoxes[second] &&
        takenBoxes[second] === takenBoxes[third]) 
        return takenBoxes[first];
    return null;
}

function displayWinner() 
{
    winner = getWinner();
    //display winner message by using winner: if winner is 'x' it should say "You won!"
    //   and if winner is 'o' it should say "You lost!". Message is displayer
    // using result element at the bottom of the html page.
    //alert('Game Over!'); //placeholder
    const resultContainer = document.querySelector('#result');
    const headingMsg = document.createElement('h1');
    if(winner === 'x')
        headingMsg.textContent = "You Won!";
    else if(winner == 'o')
        headingMsg.textContent = "You lost!";
    else
        headingMsg.textContent = "It is a Tie!";

    resultContainer.appendChild(headingMsg);

    // remove all remaining event listeners
    for(const box of freeBoxes)
        box.removeEventListener('click', playACycle);
}

const freeBoxes = [];
const takenBoxes = {}; // empty dictionary for mapping of box id to owner
const gridItems = document.querySelectorAll('#grid div');
for(const item of gridItems) {
    item.addEventListener('click', playACycle);
    freeBoxes.push(item);
}
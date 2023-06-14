let selectedColor = null;

/*
* event listeners for choosing the current color
*/
const colorBoxes = document.querySelectorAll('.color-box');
colorBoxes.forEach(colorBox => {
    colorBox.addEventListener('click', function() {
        console.log('color box clicked');
        // remove highlight from previously selected color box
        const selectedColorBox = document.querySelector('.color-box.selected');
        if (selectedColorBox) {
            selectedColorBox.classList.remove('selected');
        }
        if (selectedColorBox != this) {
            // highlight the current color box
            this.classList.add('selected');
            // set the selected color
            selectedColor = getComputedStyle(this).backgroundColor;
        }
        // allows user to deselect a color
        else {
            selectedColor = null;
        }
    });
});

/*
* event listeners for coloring the squares
*/
const squares = document.querySelectorAll('.square');
squares.forEach(square => {
    square.addEventListener('click', function() {
        console.log('square clicked');
        if (selectedColor) {
            this.style.backgroundColor = selectedColor;
        }
    });
});

/*
* sets all squares to a given color
*/
function setSquares(color) {
    console.log('set squares');
    squares.forEach(square => {
        square.style.backgroundColor = color;
    });
}

/*
* sets all squares to white
*/
function resetSquares() {
    console.log('reset squares');
    setSquares('white');
}

/*
* sets all squares to darkgray, which appears as no color
*/
function clearSquares() {
    console.log('clear squares');
    setSquares('darkgray');
}

/*
* returns an array of the colors of the squares in a given face
* the array is ordered from top left to bottom right
*/
function getFace(face) {
    let faceArray = [];
    const squares = document.getElementById(face).children
    console.log(squares);
    Array.from(squares).forEach(child => {
        faceArray.push(getComputedStyle(child).backgroundColor);
    });
    return faceArray;
}

/*
* returns a string representing the current state of the cube
* the string is ordered as follows:
* U, L, F, R, B, D
* each face goes from top left to bottom right
*/
function getCubeString() {
    const faces = ['U', 'L', 'F', 'R', 'B', 'D'];
    const bgColor = getComputedStyle(document.body).backgroundColor;
    const colorMap = new Map();
    // getting faces and center colors
    let faceStates = [];
    faces.forEach(face => {
        const faceArray = getFace(face);
        const center = faceArray[4];
        if (center == bgColor) {
            throw new Error('Cube is not fully defined. Please try again.');
        }
        if (colorMap.has(center)) {
            throw new Error('Each center color must be used exactly once. Please try again.');
        }
        colorMap.set(center, face);
        faceStates.push(faceArray);
    });
    // translating cube state to string
    let cubeString = '';
    faceStates.forEach(faceState => {
        faceState.forEach(color => {
            if (color == bgColor) {
                throw new Error('Cube is not fully defined. Please try again.');
            }
            const colorStr = colorMap.get(color);
            if (colorStr == undefined) {
                throw new Error('All colors need a corresponding center. Please try again.');
            }
            cubeString += colorStr;
        });
    });
    console.log(`cubeString: ${cubeString}`);
    return cubeString;
}

/*
* calls the backend API to solve the cube
* displays the solution or an error message
*/
async function callAPI(cubeString) {
    // backend url with query string
    // var url = new URL('/api/solve', window.location.origin);
    // var url = new URL('http://localhost:5000/api/solve');  // local
    var url = new URL('https://rubiks-cube-solver.vercel.app/api/solve');  // vercel
    url.searchParams.append('cubeString', cubeString);
    
    // response from backend
    const response = await fetch(url);
    console.log('received response');
    console.log(response);
    const data = await response.json();
    console.log('received data');
    console.log(data);

    // display solution
    if (data.solution) {
        console.log(`solution: ${data.solution}`);
        const sol_text = document.getElementById('solution-text');
        sol_text.innerHTML = data.solution;
        if (data.solution == ' ') {
            alert('Cube is already solved!');
        }
        return data.solution;
    }
    // display error message
    else {
        console.log(`error: ${data.error}`);
        let errorMessage;
        switch (data.error) {
            case 'Invalid cube: each colour should appear exactly 9 times':
                errorMessage = 'Each color must appear exactly 9 times. Please try again.';
            case 'Invalid cube: not all edges exist exactly once':
                errorMessage = 'Each edge must exist exactly once. Please try again.';      
            case 'Invalid cube: one edge should be flipped':
                errorMessage = 'An edge is flipped. Please try again.';
            case 'Invalid cube: not all corners exist exactly once':
                errorMessage = 'Each corner must exist exactly once. Please try again.';
            case 'Invalid cube: one corner should be twisted':
                errorMessage = 'A corner is twisted. Please try again.';
            case 'Invalid cube: two corners or edges should be exchanged':
                errorMessage = 'Two corners or edges are swapped. Please try again.'; 
            default:
                errorMessage = data.error;
        }
        console.error(errorMessage);
        alert(errorMessage);
        return errorMessage;
    }
}

/*
* solves the cube
*/
async function solveCube() {
    try {    
        const sol_text = document.getElementById('solution-text');
        sol_text.innerHTML = 'Solving...';
        var cubeString = getCubeString();
        // var cubeString = 'UBDDUFBRRLBDDLFUUBLUFRFBDFRDDFLRLFBRLUBUBRULLRLUFDRFDB';  // test case
        console.log('calling API...');
        await callAPI(cubeString);
        console.log('API called');
    }
    catch (error) {
        console.error(error);
        alert(error);
    }

}

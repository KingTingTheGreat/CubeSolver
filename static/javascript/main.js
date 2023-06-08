let selectedColor = null;

const colorBoxes = document.querySelectorAll('.color-box');
colorBoxes.forEach(colorBox => {
    colorBox.addEventListener('click', function() {
        // remove highlight from previously selected color box
        const selectedColorBox = document.querySelector('.color-box.selected');
        if (selectedColorBox) {
            selectedColorBox.classList.remove('selected');
        }
        // highlight the current color box
        this.classList.add('selected');
        // set the selected color
        selectedColor = this.style.backgroundColor;
    });
});

const squares = document.querySelectorAll('.square');
squares.forEach(square => {
    square.addEventListener('click', function() {
        if (selectedColor) {
            this.style.backgroundColor = selectedColor;
        }
    });
});
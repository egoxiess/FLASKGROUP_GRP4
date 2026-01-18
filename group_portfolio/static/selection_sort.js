let numbers = [];
let isAnimating = false;
let currentMinIndex = -1;

function addNumber() {
    const input = document.getElementById('numberInput');
    const value = parseInt(input.value);
    
    if (isNaN(value)) {
        alert('Please enter a valid number!');
        return;
    }
    
    numbers.push(value);
    input.value = '';
    updateArrayDisplay();
    input.focus();
}

function updateArrayDisplay() {
    const display = document.getElementById('arrayDisplay');
    
    if (numbers.length === 0) {
        display.innerHTML = '<p class="empty-message">No numbers yet. Add some numbers to begin!</p>';
        return;
    }
    
    display.innerHTML = numbers.map(num => 
        `<span class="array-number">${num}</span>`
    ).join('');
}

function resetArray() {
    if (isAnimating) {
        alert('Please wait for the animation to finish!');
        return;
    }

    numbers = [];
    currentMinIndex = -1;
    updateArrayDisplay();
    document.getElementById('visualization').innerHTML = '';
}

async function startSelectionSort() {
    if (numbers.length === 0) {
        alert('Please add some numbers first!');
        return;
    }
    
    if (isAnimating) {
        return;
    }

    isAnimating = true;
    currentMinIndex = -1; 
    document.getElementById('sortBtn').disabled = true;
    
    try {
        const response = await fetch('/selection-sort', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ numbers: numbers })
        });
        
        const data = await response.json();
        await animateSelectionSort(data.steps);
        updateArrayDisplay();
        
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during sorting!');
    } finally {
        isAnimating = false;
        document.getElementById('sortBtn').disabled = false;
    }
}

function createSelections(array) {
    const visualization = document.getElementById('visualization');
    visualization.innerHTML = '';
    
    array.forEach((num, index) => {
        const selection = document.createElement('div');
        selection.className = 'selection';
        selection.id = `selection-${index}`;
        selection.innerHTML = `
            <div class="min-label">Min. Digit</div>
            <div class="selection-box">${num}</div>
            <div class="selection-index">Index ${index}</div>
        `;
        visualization.appendChild(selection);
    });
}

async function animateSelectionSort(steps) {
    createSelections(steps[0].array);
    
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        
        if (step.type === 'min_update') {
            await updateCurrentMin(step.indices[0]);
        } else if (step.type === 'compare') {
            await highlightComparison(step.indices);
        } else if (step.type === 'swap') {
            await animateSwap(step.indices, step.array);
        } else if (step.type === 'done') {
            markAllSorted();
        }
        
        await sleep(300);
    }
    currentMinIndex = -1; 
}

async function updateCurrentMin(newMinIndex) {
    if (currentMinIndex !== -1) {
        const prevSelection = document.getElementById(`selection-${currentMinIndex}`);
        if (prevSelection) prevSelection.classList.remove('current-min');
    }
    
    currentMinIndex = newMinIndex;
    const selection = document.getElementById(`selection-${currentMinIndex}`);
    if (selection) selection.classList.add('current-min');
    
    await sleep(200); 
}

async function highlightComparison(indices) {
    indices.forEach(idx => {
        const selection = document.getElementById(`selection-${idx}`);
        if (selection) {
            selection.classList.add('comparing');
        }
    });
    
    await sleep(500);
    indices.forEach(idx => {
        const selection = document.getElementById(`selection-${idx}`);
        if (selection) {
            selection.classList.remove('comparing');
        }
    });
}

async function animateSwap(indices, newArray) {
    const [idx1, idx2] = indices;
    const selection1 = document.getElementById(`selection-${idx1}`);
    const selection2 = document.getElementById(`selection-${idx2}`);
    
    if (!selection1 || !selection2) return;
    
    selection1.classList.add('swapping');
    selection2.classList.add('swapping');
    
    await sleep(800);
    
    selection1.querySelector('.selection-box').textContent = newArray[idx1];
    selection2.querySelector('.selection-box').textContent = newArray[idx2];
    
    selection1.classList.remove('swapping');
    selection2.classList.remove('swapping');
}

function markAllSorted() {
    const selections = document.querySelectorAll('.selection');
    selections.forEach((selection, index) => {
        selection.classList.remove('current-min'); 
        setTimeout(() => {
            selection.classList.add('sorted');
        }, index * 100);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('numberInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addNumber();
        }
    });
});

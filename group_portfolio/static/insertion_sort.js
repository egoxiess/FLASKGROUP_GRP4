let numbers = [];
let isAnimating = false;

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

    display.innerHTML = numbers
        .map(num => `<span class="array-number">${num}</span>`)
        .join('');
}

function resetArray() {
    if (isAnimating) {
        alert('Please wait for the animation to finish!');
        return;
    }

    numbers = [];
    updateArrayDisplay();
    document.getElementById('visualization').innerHTML = '';
}

async function startInsertionSort() {
    if (numbers.length === 0) {
        alert('Please add some numbers first!');
        return;
    }

    if (isAnimating) return;

    isAnimating = true;
    document.getElementById('sortBtn').disabled = true;

    try {
        const response = await fetch('/insertion-sort', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numbers })
        });

        const data = await response.json();
        await animateSort(data.steps);

        numbers = data.steps[data.steps.length - 1].array;
        updateArrayDisplay();

    } catch (error) {
        console.error(error);
        alert('An error occurred during sorting!');
    } finally {
        isAnimating = false;
        document.getElementById('sortBtn').disabled = false;
    }
}

function drawArray(array) {
    const visualization = document.getElementById('visualization');
    visualization.innerHTML = '';

    array.forEach((num, index) => {
        const box = document.createElement('div');
        box.className = 'selection';
        box.innerHTML = `
            <div class="selection-box">${num}</div>
            <div class="selection-index">Index ${index}</div>
        `;
        visualization.appendChild(box);
    });
}

async function animateSort(steps) {
    drawArray(steps[0].array);

    for (const step of steps) {
        if (step.type === 'compare') {
            highlightComparison(step.indices);
        } 
        else if (step.type === 'swap' || step.type === 'insert') {
            drawArray(step.array);
        } 
        else if (step.type === 'done') {
            markAllSorted();
        }

        await sleep(400);
    }
}

function highlightComparison(indices) {
    indices.forEach(idx => {
        const el = document.querySelectorAll('.selection')[idx];
        if (el) el.classList.add('comparing');
    });

    setTimeout(() => {
        indices.forEach(idx => {
            const el = document.querySelectorAll('.selection')[idx];
            if (el) el.classList.remove('comparing');
        });
    }, 300);
}

function markAllSorted() {
    document.querySelectorAll('.selection').forEach((el, i) => {
        setTimeout(() => el.classList.add('sorted'), i * 100);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('numberInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') addNumber();
    });
});

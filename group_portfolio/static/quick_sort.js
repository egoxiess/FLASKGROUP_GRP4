let numbers = []; 
let boxElements = []; 
let isAnimating = false;

const BOX_WIDTH = 60;
const GAP = 20;

function addNumber() {
    const input = document.getElementById('numberInput');
    const value = parseInt(input.value);
    const visualization = document.getElementById('visualization');
    
    if (isNaN(value)) {
        alert('Please enter a valid number!');
        return;
    }
    
    if (numbers.length === 0) {
        visualization.innerHTML = '';
    }
    
    numbers.push(value);
    
    const box = createBoxElement(value, numbers.length - 1);
    boxElements.push(box);
    visualization.appendChild(box);
    
    renderPositions();
    
    input.value = '';
    input.focus();
}

function createBoxElement(num, index) {
    const box = document.createElement('div');
    box.className = 'box-container';
    box.id = `box-id-${Date.now()}-${Math.random()}`; 
    box.innerHTML = `
        <div class="pivot-label">
            <span class="pivot-text">PIVOT</span>
            <span class="pivot-arrow">▼</span>
        </div>
        <div class="box-shape">${num}</div>
        <div class="box-index">Index ${index}</div>
    `;
    return box;
}

function renderPositions() {
    const visualization = document.getElementById('visualization');
    const containerWidth = visualization.clientWidth;
    const totalBoxes = boxElements.length;
    
    if (totalBoxes === 0) return;

    const totalGroupWidth = (totalBoxes * BOX_WIDTH) + ((totalBoxes - 1) * GAP);
    let startX = (containerWidth - totalGroupWidth) / 2;
    if (startX < 20) startX = 20;

    boxElements.forEach((box, index) => {
        const leftPos = startX + (index * (BOX_WIDTH + GAP));
        box.style.left = `${leftPos}px`;
        
        const indexLabel = box.querySelector('.box-index');
        if(indexLabel) indexLabel.textContent = `Index ${index}`;
    });
}

function resetArray() {
    if (isAnimating) {
        alert('Please wait for the animation to finish!');
        return;
    }
    numbers = [];
    boxElements = [];
    document.getElementById('visualization').innerHTML = '<div class="empty-message">Currently Empty</div>';
}

async function startQuickSort() {
    if (numbers.length === 0) {
        alert('Please add some numbers first!');
        return;
    }
    
    if (isAnimating) return;

    isAnimating = true;
    document.getElementById('sortBtn').disabled = true;
    
    try {
        const response = await fetch('/quick-sort', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numbers: numbers })
        });
        
        const data = await response.json();
        await animateQuickSort(data.steps);
        
        numbers = data.steps[data.steps.length - 1].array;
        
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during sorting!');
    } finally {
        isAnimating = false;
        document.getElementById('sortBtn').disabled = false;
    }
}

async function animateQuickSort(steps) {
    document.querySelectorAll('.box-container').forEach(b => b.classList.remove('pivot', 'sorted'));

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        
        if (step.type === 'pivot') {
            await highlightPivot(step.indices[0]);
        } else if (step.type === 'compare') {
            await highlightComparison(step.indices);
        } else if (step.type === 'swap') {
            await animateSwap(step.indices);
        } else if (step.type === 'sorted-pivot') {
            markPivotSorted(step.indices[0]);
        } else if (step.type === 'done') {
            markAllSorted();
        }
        
        await sleep(200);
    }
}

async function highlightPivot(index) {
    boxElements.forEach(box => {
        if(!box.classList.contains('sorted')) box.classList.remove('pivot');
    });

    if (boxElements[index]) {
        boxElements[index].classList.add('pivot');
    }
    await sleep(200);
}

function markPivotSorted(index) {
    if (boxElements[index]) {
        boxElements[index].classList.remove('pivot');
        boxElements[index].classList.add('sorted');
    }
}

async function highlightComparison(indices) {
    indices.forEach(idx => {
        if (boxElements[idx]) boxElements[idx].classList.add('comparing');
    });
    
    await sleep(300);
    
    indices.forEach(idx => {
        if (boxElements[idx]) boxElements[idx].classList.remove('comparing');
    });
}

async function animateSwap(indices) {
    const [idx1, idx2] = indices;
    if (idx1 === idx2) return;

    const box1 = boxElements[idx1];
    const box2 = boxElements[idx2];
    
    box1.classList.add('swapping');
    box2.classList.add('swapping');

    [boxElements[idx1], boxElements[idx2]] = [boxElements[idx2], boxElements[idx1]];

    renderPositions();

    await sleep(600);
    
    box1.classList.remove('swapping');
    box2.classList.remove('swapping');
}

function markAllSorted() {
    boxElements.forEach((box, index) => {
        box.classList.remove('pivot'); 
        setTimeout(() => {
            box.classList.add('sorted');
        }, index * 50);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('numberInput');
    if(input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addNumber();
            }
        });
    }
});

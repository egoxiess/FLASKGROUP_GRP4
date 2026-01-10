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
    updateArrayDisplay();
    document.getElementById('visualization').innerHTML = '';
}

async function startBubbleSort() {
    if (numbers.length === 0) {
        alert('Please add some numbers first!');
        return;
    }
    
    if (isAnimating) {
        return;
    }

    isAnimating = true;
    document.getElementById('sortBtn').disabled = true;
    
    try {
        const response = await fetch('/bubble-sort', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ numbers: numbers })
        });
        
        const data = await response.json();
        await animateBubbleSort(data.steps);
        numbers = data.steps[data.steps.length - 1].array;
        updateArrayDisplay();
        
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during sorting!');
    } finally {
        isAnimating = false;
        document.getElementById('sortBtn').disabled = false;
    }
}

function createBubbles(array) {
    const visualization = document.getElementById('visualization');
    visualization.innerHTML = '';
    
    array.forEach((num, index) => {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.id = `bubble-${index}`;
        bubble.innerHTML = `
            <div class="bubble-circle">${num}</div>
            <div class="bubble-index">Index ${index}</div>
        `;
   
        visualization.appendChild(bubble);
    });
}

async function animateBubbleSort(steps) {
    createBubbles(steps[0].array);
    
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        
        if (step.type === 'compare') {
            await highlightComparison(step.indices);
        } else if (step.type === 'swap') {
            await animateSwap(step.indices, step.array);
        } else if (step.type === 'done') {
            markAllSorted();
        }
        
        await sleep(300);
    }
}

async function highlightComparison(indices) {
    indices.forEach(idx => {
        const bubble = document.getElementById(`bubble-${idx}`);
        if (bubble) {
            bubble.classList.add('comparing');
        }
    });
    
    await sleep(500);
    indices.forEach(idx => {
        const bubble = document.getElementById(`bubble-${idx}`);
        if (bubble) {
            bubble.classList.remove('comparing');
        }
    });
}

async function animateSwap(indices, newArray) {
    const [idx1, idx2] = indices;
    const bubble1 = document.getElementById(`bubble-${idx1}`);
    const bubble2 = document.getElementById(`bubble-${idx2}`);
    
    if (!bubble1 || !bubble2) return;
    
    bubble1.classList.add('swapping');
    bubble2.classList.add('swapping');
    
    await sleep(800);
    
    bubble1.querySelector('.bubble-circle').textContent = newArray[idx1];
    bubble2.querySelector('.bubble-circle').textContent = newArray[idx2];
    
    bubble1.classList.remove('swapping');
    bubble2.classList.remove('swapping');
}

function markAllSorted() {
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach((bubble, index) => {
        setTimeout(() => {
            bubble.classList.add('sorted');
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
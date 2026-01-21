let numbers = [];
let isAnimating = false;

function addNumber() {
  const input = document.getElementById("numberInput");
  const value = parseInt(input.value);
  if (isNaN(value)) return;
  numbers.push(value);
  input.value = "";
  updateArrayDisplay();
}

function updateArrayDisplay() {
  const display = document.getElementById("arrayDisplay");
  if (numbers.length === 0) {
    display.innerHTML = '<div class="empty-message">No numbers yet. Add some numbers to begin!</div>';
    return;
  }
  display.innerHTML = numbers.map(n => `<span class="array-number">${n}</span>`).join("");
}

function resetArray() {
  if (isAnimating) return;
  numbers = [];
  updateArrayDisplay();
  document.getElementById("visualization").innerHTML = "";
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startMergeSort() {
  if (numbers.length === 0 || isAnimating) return;
  isAnimating = true;
  document.getElementById("sortBtn").disabled = true;

  const steps = [];
  const arr = [...numbers];
  mergeSort(arr, 0, arr.length - 1, steps);

  await animate(steps);

  numbers = arr;
  updateArrayDisplay();
  isAnimating = false;
  document.getElementById("sortBtn").disabled = false;
}

function mergeSort(arr, left, right, steps) {
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);
  mergeSort(arr, left, mid, steps);
  mergeSort(arr, mid + 1, right, steps);
  merge(arr, left, mid, right, steps);
}

function merge(arr, left, mid, right, steps) {
  const leftArr = arr.slice(left, mid + 1);
  const rightArr = arr.slice(mid + 1, right + 1);

  steps.push({ type: "split", leftArr, rightArr, array: [...arr] });

  let i = 0, j = 0, k = left;

  while (i < leftArr.length && j < rightArr.length) {
    steps.push({ type: "compare", indices: [left + i, mid + 1 + j], array: [...arr] });

    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i++];
    } else {
      arr[k] = rightArr[j++];
    }

    steps.push({ type: "overwrite", index: k, array: [...arr] });
    k++;
  }

  while (i < leftArr.length) {
    arr[k] = leftArr[i++];
    steps.push({ type: "overwrite", index: k, array: [...arr] });
    k++;
  }

  while (j < rightArr.length) {
    arr[k] = rightArr[j++];
    steps.push({ type: "overwrite", index: k, array: [...arr] });
    k++;
  }
}

async function animate(steps) {
  const vis = document.getElementById("visualization");
  vis.innerHTML = "";

  const mainRow = document.createElement("div");
  mainRow.className = "merge-row";
  mainRow.id = "mainRow";
  vis.appendChild(mainRow);

  steps[0].array.forEach((v, idx) => {
    const block = document.createElement("div");
    block.className = "merge-block";
    block.id = `block-${idx}`;
    block.textContent = v;
    mainRow.appendChild(block);
  });

  for (const step of steps) {
    if (step.type === "split") {
      const split = document.createElement("div");
      split.className = "merge-split";

      const leftRow = document.createElement("div");
      leftRow.className = "merge-row";
      step.leftArr.forEach(v => {
        const b = document.createElement("div");
        b.className = "merge-block";
        b.textContent = v;
        leftRow.appendChild(b);
      });

      const rightRow = document.createElement("div");
      rightRow.className = "merge-row";
      step.rightArr.forEach(v => {
        const b = document.createElement("div");
        b.className = "merge-block";
        b.textContent = v;
        rightRow.appendChild(b);
      });

      split.appendChild(leftRow);
      split.appendChild(rightRow);

      vis.appendChild(split);
      await sleep(500);
      vis.removeChild(split);
    }

    if (step.type === "compare") {
      const a = document.getElementById(`block-${step.indices[0]}`);
      const b = document.getElementById(`block-${step.indices[1]}`);
      a.classList.add("compare");
      b.classList.add("compare");
      await sleep(300);
      a.classList.remove("compare");
      b.classList.remove("compare");
    }

    if (step.type === "overwrite") {
      const block = document.getElementById(`block-${step.index}`);
      block.textContent = step.array[step.index];
      block.classList.add("merging");
      await sleep(300);
      block.classList.remove("merging");
    }
  }

  document.querySelectorAll("#mainRow .merge-block").forEach(b => b.classList.add("sorted"));
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("numberInput").addEventListener("keypress", e => {
    if (e.key === "Enter") addNumber();
  });
});
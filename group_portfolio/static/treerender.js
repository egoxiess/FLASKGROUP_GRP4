document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("tree-wrapper");

    if (!treeData) {
        container.innerHTML = '<p style="text-align:center; margin-top:50px; font-family: monospace; font-size: 20px;">Tree is empty</p>';
        return;
    }

    const tree = buildTree(treeData);
    const ul = document.createElement("ul");
    ul.innerHTML = tree;
    container.appendChild(ul);

    setTimeout(() => {
        drawSvgLines(container);
    }, 100);

    window.addEventListener('resize', () => {
        drawSvgLines(container);
    });
});

function buildTree(node) {
    if (!node) return "";
    
    const safeHighlight = (typeof highlightVal !== 'undefined') ? highlightVal : null;
    const isFound = (safeHighlight !== null && node.key === safeHighlight);
    const highlightClass = isFound ? "found-node" : "";

    let html = `
        <li>
            <span class="node ${highlightClass}">${node.key}</span>
    `;

    if (node.left || node.right) {
        html += "<ul>";
        if (node.left) {
            html += buildTree(node.left);
        } else {
            html += '<li class="empty-node"><span style="display:inline-block; width:20px;"></span></li>';
        }

        if (node.right) {
            html += buildTree(node.right);
        } else {
            html += '<li class="empty-node"><span style="display:inline-block; width:20px;"></span></li>';
        }
        html += "</ul>";
    }

    html += "</li>";
    return html;
}

function drawSvgLines(container) {
    const existingSvg = document.getElementById('tree-svg-layer');
    if (existingSvg) existingSvg.remove();
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "tree-svg-layer";
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = container.scrollWidth + "px";
    svg.style.height = container.scrollHeight + "px";
    svg.style.pointerEvents = "none";
    svg.style.zIndex = "1"; 

    function getCoords(element, type) {
        const rect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const x = rect.left - containerRect.left + rect.width / 2 + container.scrollLeft;

        let y;
        if (type === 'parent') {
            y = rect.bottom - containerRect.top + container.scrollTop;
        } else {
            y = rect.top - containerRect.top + container.scrollTop;
        }
        return { x, y };
    }

    const lists = container.querySelectorAll('li');
    
    lists.forEach(li => {
        const parentSpan = li.querySelector(':scope > .node');
        if (!parentSpan) return;

        const childUl = li.querySelector(':scope > ul');
        if (childUl) {
            const childLis = childUl.children;
            for (let childLi of childLis) {
                const childSpan = childLi.querySelector(':scope > .node');
                
                if (childSpan) {
                    const start = getCoords(parentSpan, 'parent');
                    const end = getCoords(childSpan, 'child');
                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", start.x);
                    line.setAttribute("y1", start.y);
                    line.setAttribute("x2", end.x);
                    line.setAttribute("y2", end.y);
                    line.setAttribute("stroke", "#000000ff");
                    line.setAttribute("stroke-width", "3");
                    
                    svg.appendChild(line);
                }
            }
        }
    });

    container.appendChild(svg);
}
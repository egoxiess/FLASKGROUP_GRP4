document.addEventListener('DOMContentLoaded', () => {
    initDropdowns();
    initAnimation();
});

function initDropdowns() {
    const selectors = [
      { lineId: 'from-line', stationId: 'from-station' },
      { lineId: 'to-line', stationId: 'to-station' }
    ];
    
    selectors.forEach(pair => {
      const lineSelect = document.getElementById(pair.lineId);
      const stationSelect = document.getElementById(pair.stationId);
      
      if (!lineSelect || !stationSelect) return;
      
      const allGroups = Array.from(stationSelect.querySelectorAll('optgroup'));
      stationSelect.innerHTML = '<option value="">Select Station</option>';
      
      lineSelect.addEventListener('change', function() {
        const selectedLineValue = this.value;
        stationSelect.innerHTML = '<option value="">Select Station</option>';
        
        if (selectedLineValue) {
          const matchedGroup = allGroups.find(group => {
            const cleanLabel = group.label.toLowerCase().replace(/\s|line/g, '');
            return cleanLabel === selectedLineValue;
          });
          
          if (matchedGroup) {
            stationSelect.appendChild(matchedGroup.cloneNode(true));
          }
        }
      });
    });
}

// FARE INDEX
const FARE_DATA = {
    MRT3: {
        stations: ["North Avenue", "Quezon Avenue", "GMA Kamuning", "Araneta Cubao", "Santolan-Annapolis", "Ortigas", "Shaw Boulevard", "Boni", "Guadalupe", "Buendia", "Ayala", "Magallanes", "Taft Avenue"],
        matrix: {
            "North Avenue": [0, 13, 13, 16, 16, 20, 20, 20, 24, 24, 24, 28, 28],
            "Quezon Avenue": [13, 0, 13, 13, 16, 16, 20, 20, 20, 24, 24, 24, 28],
            "GMA Kamuning": [13, 13, 0, 13, 13, 16, 16, 20, 20, 20, 24, 24, 24],
            "Araneta Cubao": [16, 13, 13, 0, 13, 13, 16, 16, 20, 20, 20, 24, 24],
            "Santolan-Annapolis": [16, 16, 13, 13, 0, 13, 13, 16, 16, 20, 20, 20, 24],
            "Ortigas": [20, 16, 16, 13, 13, 0, 13, 13, 16, 16, 20, 20, 20],
            "Shaw Boulevard": [20, 20, 16, 16, 13, 13, 0, 13, 13, 16, 16, 20, 20],
            "Boni": [20, 20, 20, 16, 16, 13, 13, 0, 13, 13, 16, 16, 20],
            "Guadalupe": [24, 20, 20, 20, 16, 16, 13, 13, 0, 13, 13, 16, 16],
            "Buendia": [24, 24, 20, 20, 20, 16, 16, 13, 13, 0, 13, 13, 16],
            "Ayala": [24, 24, 24, 20, 20, 20, 16, 16, 13, 13, 0, 13, 13],
            "Magallanes": [28, 24, 24, 24, 20, 20, 20, 16, 16, 13, 13, 0, 13],
            "Taft Avenue": [28, 28, 24, 24, 24, 20, 20, 20, 16, 16, 13, 13, 0]
        }
    },
    LRT2: {
        stations: ["Recto", "Legarda", "Pureza", "V. Mapa", "J. Ruiz", "Gilmore", "Betty Go-Belmonte", "Araneta Cubao", "Anonas", "Katipunan", "Santolan", "Marikina-Pasig", "Antipolo"],
        matrix: {
            "Recto": [0, 15, 20, 20, 20, 25, 25, 25, 25, 30, 30, 35, 35],
            "Legarda": [15, 0, 15, 20, 20, 20, 25, 25, 25, 25, 30, 30, 35],
            "Pureza": [20, 15, 0, 15, 20, 20, 20, 20, 25, 25, 30, 30, 30],
            "V. Mapa": [20, 20, 15, 0, 15, 20, 20, 20, 20, 25, 25, 30, 30],
            "J. Ruiz": [20, 20, 20, 15, 0, 15, 20, 20, 20, 20, 25, 25, 30],
            "Gilmore": [25, 20, 20, 20, 15, 0, 15, 20, 20, 20, 25, 25, 30],
            "Betty Go-Belmonte": [25, 25, 20, 20, 20, 15, 0, 15, 20, 20, 20, 25, 25],
            "Araneta Cubao": [25, 25, 20, 20, 20, 20, 15, 0, 15, 20, 20, 25, 25],
            "Anonas": [25, 25, 25, 20, 20, 20, 20, 15, 0, 15, 20, 20, 25],
            "Katipunan": [30, 25, 25, 25, 20, 20, 20, 20, 15, 0, 20, 20, 25],
            "Santolan": [30, 30, 30, 25, 25, 25, 20, 20, 20, 20, 0, 15, 20],
            "Marikina-Pasig": [35, 30, 30, 30, 25, 25, 25, 25, 20, 20, 15, 0, 20],
            "Antipolo": [35, 35, 30, 30, 30, 30, 25, 25, 25, 25, 20, 20, 0]
        }
    },
    LRT1: {
        stations: ["Dr. Santos", "Ninoy Aquino Avenue", "PITX", "MIA Road", "Redemptorist-Aseana", "Baclaran", "EDSA", "Libertad", "Gil Puyat", "Vito Cruz", "Quirino", "Pedro Gil", "United Nations", "Central Terminal", "Carriedo", "Doroteo Jose", "Bambang", "Tayuman", "Blumentritt", "Abad Santos", "R. Papa", "5th Avenue", "Monumento", "Balintawak", "Fernando Poe Jr."],
        matrix: {
            "Dr. Santos": [0, 20, 20, 25, 25, 30, 30, 30, 30, 35, 35, 35, 35, 40, 40, 40, 40, 40, 45, 45, 45, 45, 50, 50, 55],
            "Ninoy Aquino Avenue": [20, 0, 20, 20, 25, 25, 25, 30, 30, 30, 30, 35, 35, 35, 35, 40, 40, 40, 40, 40, 45, 45, 45, 50, 50],
            "PITX": [20, 20, 0, 20, 20, 25, 25, 25, 25, 30, 30, 30, 30, 35, 35, 35, 35, 40, 40, 40, 40, 40, 45, 45, 50],
            "MIA Road": [25, 20, 20, 0, 20, 20, 20, 25, 25, 25, 30, 30, 30, 30, 35, 35, 35, 35, 40, 40, 40, 40, 40, 45, 50],
            "Redemptorist-Aseana": [25, 25, 20, 20, 0, 20, 20, 25, 25, 25, 25, 30, 30, 30, 30, 35, 35, 35, 35, 35, 40, 40, 40, 45, 45],
            "Baclaran": [30, 25, 25, 20, 20, 0, 20, 20, 20, 25, 25, 25, 25, 30, 30, 30, 30, 30, 35, 35, 35, 35, 40, 40, 45],
            "EDSA": [30, 25, 25, 20, 20, 20, 0, 20, 20, 20, 25, 25, 25, 30, 30, 30, 30, 30, 35, 35, 35, 35, 40, 40, 45],
            "Libertad": [30, 30, 25, 25, 25, 20, 20, 0, 20, 20, 20, 25, 25, 25, 25, 30, 30, 30, 30, 30, 35, 35, 35, 40, 40],
            "Gil Puyat": [30, 30, 25, 25, 25, 20, 20, 20, 0, 20, 20, 20, 25, 25, 25, 25, 30, 30, 30, 30, 30, 35, 35, 40, 40],
            "Vito Cruz": [35, 30, 30, 25, 25, 25, 20, 20, 20, 0, 20, 20, 20, 25, 25, 25, 25, 25, 30, 30, 30, 30, 35, 35, 40],
            "Quirino": [35, 30, 30, 30, 25, 25, 25, 20, 20, 20, 0, 20, 20, 20, 25, 25, 25, 25, 25, 30, 30, 30, 35, 35, 40],
            "Pedro Gil": [35, 35, 30, 30, 30, 25, 25, 25, 20, 20, 20, 0, 20, 20, 20, 25, 25, 25, 25, 25, 30, 30, 30, 35, 35],
            "United Nations": [35, 35, 30, 30, 30, 25, 25, 25, 25, 20, 20, 20, 0, 20, 20, 20, 25, 25, 25, 25, 25, 30, 30, 35, 35],
            "Central Terminal": [40, 35, 35, 30, 30, 30, 30, 25, 25, 25, 20, 20, 20, 0, 20, 20, 20, 20, 25, 25, 25, 25, 30, 30, 35],
            "Carriedo": [40, 35, 35, 35, 30, 30, 30, 25, 25, 25, 25, 20, 20, 20, 0, 20, 20, 20, 20, 25, 25, 25, 25, 30, 35],
            "Doroteo Jose": [40, 40, 35, 35, 35, 30, 30, 30, 25, 25, 25, 25, 20, 20, 20, 0, 20, 20, 20, 20, 20, 25, 25, 30, 30],
            "Bambang": [40, 40, 35, 35, 35, 30, 30, 30, 30, 25, 25, 25, 25, 20, 20, 20, 0, 20, 20, 20, 20, 25, 25, 30, 30],
            "Tayuman": [40, 40, 40, 35, 35, 30, 30, 30, 30, 25, 25, 25, 25, 20, 20, 20, 20, 0, 20, 20, 20, 20, 25, 30, 30],
            "Blumentritt": [45, 40, 40, 35, 35, 35, 35, 30, 30, 30, 30, 25, 25, 25, 20, 20, 20, 20, 0, 20, 20, 20, 25, 25, 30],
            "Abad Santos": [45, 40, 40, 40, 35, 35, 35, 30, 30, 30, 30, 30, 25, 25, 25, 20, 20, 20, 20, 0, 20, 20, 20, 25, 30],
            "R. Papa": [45, 45, 40, 40, 40, 35, 35, 35, 30, 30, 30, 30, 25, 25, 25, 20, 20, 20, 20, 20, 0, 20, 20, 25, 25],
            "5th Avenue": [45, 45, 40, 40, 40, 35, 35, 35, 35, 30, 30, 30, 30, 25, 25, 25, 25, 20, 20, 20, 20, 0, 20, 25, 25],
            "Monumento": [50, 45, 45, 40, 40, 40, 40, 35, 35, 35, 35, 30, 30, 30, 25, 25, 25, 25, 25, 20, 20, 20, 0, 20, 25],
            "Balintawak": [50, 50, 45, 45, 45, 40, 40, 40, 40, 35, 35, 35, 35, 30, 30, 30, 30, 30, 25, 25, 25, 25, 20, 0, 20],
            "Fernando Poe Jr.": [55, 50, 50, 50, 45, 45, 45, 40, 40, 40, 40, 35, 35, 35, 35, 30, 30, 30, 30, 30, 25, 25, 25, 20, 0]
        }
    }
};

function getStationLine(station) {
    if (FARE_DATA.MRT3.stations.includes(station)) return 'MRT3';
    if (FARE_DATA.LRT2.stations.includes(station)) return 'LRT2';
    if (FARE_DATA.LRT1.stations.includes(station)) return 'LRT1';
    return null;
}

function getSegmentFare(line, start, end) {
    const data = FARE_DATA[line];
    if (!data) return 0;

    const endIndex = data.stations.indexOf(end);
    if (endIndex === -1) return 0;

    const prices = data.matrix[start];
    if (!prices) return 0;
    
    return prices[endIndex];
}

// FARE CALCULATION
function calculateTotalFare(path) {
    if (!path || path.length < 2) return 0;

    let totalFare = 0;
    let segmentStart = path[0];
    let currentLine = getStationLine(path[0]);
    let nextLine = getStationLine(path[1]);

    if (currentLine !== nextLine && nextLine) {
        currentLine = nextLine;
    }

    for (let i = 0; i < path.length - 1; i++) {
        const u = path[i];
        const v = path[i+1];

        let hopLine = null;
        if (FARE_DATA.MRT3.stations.includes(u) && FARE_DATA.MRT3.stations.includes(v)) hopLine = 'MRT3';
        else if (FARE_DATA.LRT2.stations.includes(u) && FARE_DATA.LRT2.stations.includes(v)) hopLine = 'LRT2';
        else if (FARE_DATA.LRT1.stations.includes(u) && FARE_DATA.LRT1.stations.includes(v)) hopLine = 'LRT1';
        else hopLine = 'TRANSFER';

        if (hopLine !== currentLine) {
            const segmentEnd = path[i];
            if (currentLine && currentLine !== 'TRANSFER') {
                totalFare += getSegmentFare(currentLine, segmentStart, segmentEnd);
            }

            if (hopLine === 'TRANSFER') {
                segmentStart = path[i+1];
                if (i + 2 < path.length) {
                    const nextU = path[i+1];
                    const nextV = path[i+2];
                    if (FARE_DATA.MRT3.stations.includes(nextU) && FARE_DATA.MRT3.stations.includes(nextV)) currentLine = 'MRT3';
                    else if (FARE_DATA.LRT2.stations.includes(nextU) && FARE_DATA.LRT2.stations.includes(nextV)) currentLine = 'LRT2';
                    else currentLine = 'LRT1';
                }
            } else {
                segmentStart = path[i];
                currentLine = hopLine;
            }
        }
    }

    const finalEnd = path[path.length - 1];
    if (segmentStart !== finalEnd && currentLine !== 'TRANSFER') {
        totalFare += getSegmentFare(currentLine, segmentStart, finalEnd);
    }

    return totalFare;
}

// ANIMATION + DISPLAY
function initAnimation() {
    const dataContainer = document.getElementById('bfs-data');
    if (!dataContainer) return;

    const pathRaw = dataContainer.dataset.path;
    if (!pathRaw || pathRaw === "null") return;

    const finalPath = JSON.parse(pathRaw);

    if (finalPath.length > 0) {
        const price = calculateTotalFare(finalPath);
        const fareContainer = document.getElementById('fare-container');
        const fareAmount = document.getElementById('fare-amount');
        if (fareContainer && fareAmount) {
            fareAmount.textContent = "₱ " + price;
            fareContainer.style.display = "block";
        }

        animatePath(finalPath);
    }
}

function animatePath(finalPath) {
    let j = 0;
    const btn = document.querySelector('.calculate-btn');
    if(btn) btn.disabled = true;

    const pathInterval = setInterval(() => {
        if (j >= finalPath.length) {
            clearInterval(pathInterval);
            if(btn) btn.disabled = false;
            return;
        }

        const stationName = finalPath[j];
        const element = document.getElementById('station-' + stationName);
        if (element) {
            element.classList.add('shortest-path');
        }
        j++;
    }, 100);
}

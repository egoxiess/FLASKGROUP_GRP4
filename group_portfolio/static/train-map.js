document.addEventListener('DOMContentLoaded', () => {
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
});

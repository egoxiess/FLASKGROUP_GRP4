document.addEventListener('DOMContentLoaded', () => {
  // 1. Define the pairs (From section and To section)
  const selectors = [
    { lineId: 'from-line', stationId: 'from-station' },
    { lineId: 'to-line', stationId: 'to-station' }
  ];
  
  selectors.forEach(pair => {
    const lineSelect = document.getElementById(pair.lineId);
    const stationSelect = document.getElementById(pair.stationId);
    
    if (!lineSelect || !stationSelect) return;
    
    // 2. Take a "snapshot" of all optgroups so we don't lose them when we clear the list
    const allGroups = Array.from(stationSelect.querySelectorAll('optgroup'));
    
    // 3. Clear the station dropdown initially (only show the placeholder)
    stationSelect.innerHTML = '<option value="">Select Station</option>';
    
    lineSelect.addEventListener('change', function() {
      const selectedLineValue = this.value; // e.g., "lrt1"
      
      // Reset the dropdown to just the placeholder
      stationSelect.innerHTML = '<option value="">Select Station</option>';
      
      if (selectedLineValue) {
        // 4. Find the matching group. 
        // This logic matches "lrt1" (value) to "LRT Line 1" (label)
        const matchedGroup = allGroups.find(group => {
          // Turn "LRT Line 1" into "lrt1" for a perfect comparison
          const cleanLabel = group.label.toLowerCase().replace(/\s|line/g, '');
          return cleanLabel === selectedLineValue;
        });
        
        if (matchedGroup) {
          // 5. Clone the group and add it back to the select
          stationSelect.appendChild(matchedGroup.cloneNode(true));
        }
      }
    });
  });
});
--- 
title: "Coming at it Sideways"
author: "James Smits"
description: "When solving a problem literally went sideways."
heading: "Sideways"
subtitle: "great movie btw"
header-image-alt-text: "bright abstract angles with whites, yellows, blues, and reds"
publish-date: "2025-03-04"

---

I found myself with my head crooked 90 degrees to the left while trying to use my mouse on a screen that had also been rotated 90 degrees. I had been wrestling with the unenviable task of converting sprawling HTML tables into polished marketing PDFs. The challenge? Condensing enormous tables into the limited real estate of a printable PDF—without losing quality. Each table contained 5 columns of valuable information, followed by 6 columns of hyperlinks with hundreds of rows going well below the fold. Complicating matters, there were 5 columns of useful information followed by 6 columns of links. Links that would be useless in a PDF as hyperlinks don't work that great in print :).

Enter a scrappy yet effective solution: manipulate the DOM with JavaScript injected right through the browser's dev tools.

First I needed to get rid of those link columns.  They were after a column with the header "Poles". 

<pre>
<code class="language-javascript">
(() => {
    const table = document.querySelector(".ReferencePageTable");

    const headers = table.querySelectorAll("th");
    let polesIndex = -1;

    headers.forEach((th, index) => {
        if (th.textContent.trim().toLowerCase() === "poles") {
            polesIndex = index;
        }
    });

    // Remove columns after "Poles"
    table.querySelectorAll("tr").forEach(row => {
        row.querySelectorAll("td, th").forEach((cell, index) => {
            if (index >= polesIndex) {
                cell.remove();
            }
        });
    });
})();
</code>
</pre>

This removed all the link columns revealing just the columns that I needed.

So far so good.

Now I needed to break the table into smaller chunks.  I noticed that voltage would be a great characteristic to group by.  I needed a filter:

<pre>
<code class="language-javascript">
(function() {
    // Create filter container
    const filterContainer = document.createElement('div');
    filterContainer.style.marginBottom = '10px';
    filterContainer.innerHTML = '&lt;label for="voltageFilter"&gt;Filter by Voltage: &lt;/label&gt;';
    
    // Create dropdown filter
    const voltageFilter = document.createElement('select');
    voltageFilter.id = 'voltageFilter';
    voltageFilter.innerHTML = '&lt;option value=""&gt;All&lt;/option&gt;';
    
    // Get all voltage values from the table
    const table = document.querySelector('.ReferencePageTable');
    const rows = table.querySelectorAll('tbody tr');
    const voltageSet = new Set();
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 1) {
            const voltageCell = cells[1].textContent.trim();
            if (voltageCell) {
                voltageSet.add(voltageCell);
            }
        }
    });
    
    // Populate the dropdown with unique voltage values
    Array.from(voltageSet).sort().forEach(voltage => {
        const option = document.createElement('option');
        option.value = voltage;
        option.textContent = voltage;
        voltageFilter.appendChild(option);
    });
    
    filterContainer.appendChild(voltageFilter);
    
    // Insert the filter above the table
    table.parentNode.insertBefore(filterContainer, table);
    
    // Add event listener to filter rows based on selected voltage
    voltageFilter.addEventListener('change', function() {
        const selectedVoltage = this.value;
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 1) {
                const voltageCell = cells[1].textContent.trim();
                if (selectedVoltage === '' || voltageCell === selectedVoltage) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    });
})();
</code>
</pre>

Cut and paste into the dev tools console and bingo bango - a functioning filter on the page.

<aside>
Editor's note: at one point the author may or may not have tried to put his screen in zoomed out portrait mode to see if he could capture the whole table at once.  Working a mouse with your head tilted 90 degrees is not for the faint of heart. 
</aside>

To be forthright, I had AI write the scripts.  While I could have done the same, it's just so much faster.  

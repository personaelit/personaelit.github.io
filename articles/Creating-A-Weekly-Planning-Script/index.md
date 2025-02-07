--- 
title: "Creating  A Weekly Planning Script"
author: "James Smits"
description: "A quick post about creating a weekly planning script for use with obsidian."
heading: "A quick post about creating a weekly planning script for use with obsidian."
header-image-alt-text: "imagine a cat hammering on a keyboard creating exquisite code."
subtitle: "What to do with all this extra time?"
publish-date: "2025-02-07"

---

Regarding my <a href="../Coding-In-The-ChatGPT-Era">recent screed</a> about using chatGPT, this is how I just wrote a script to create a <a href="../Weekly-Planning">weekly planning script</a>.

I started with a block comment describing the flow

<pre><code class="language-powershell">
	# Weekly planning.
	# There is a folder for weekly planning, and a folder for Daily Journal.  
	# The weekly planning folder contains a markdown file for each week of the year.
	# The daily journal folder contains a markdown file for each day of workweek.
	# The weekly planning file contains a list links to the Daily Journal files for that week.
	# On initialization, the script will create a new weekly planning file for the current week including links to the daily journal files for that week.
	# The links will look like this: # [[YYYY-MM-DD, dddd]]
	# At the top of the weekly planning file there is a set of tags as follows, #Weekly-Planning #planning
</code>
</pre>
I told co-pilot to implement it, and it spit something that roughly looked like this. 
<pre><code class="language-powershell">
	# Define the paths for the weekly planning and daily journal folders	
	# NOTE: run this script in the same folder as the weekly planning and daily journal folders.	
	$weeklyPlanningFolder = "Weekly Planning"	
	$dailyJournalFolder = "Daily Journal"	  
	
	# Get the current date and calculate the start and end of the current week	
	$currentDate = Get-Date	
	$startOfWeek = $currentDate.AddDays(-($currentDate.DayOfWeek.value__)).Date	
	$endOfWeek = $startOfWeek.AddDays(4)  
	
	# Create the weekly planning file name	
	$weeklyPlanningFileName = "$($startOfWeek.ToString('yyyy-MM-dd')) - Weekly Planning.md"
	$weeklyPlanningFilePath = Join-Path -Path $weeklyPlanningFolder -ChildPath $weeklyPlanningFileName	  
	
	# Initialize the content of the weekly planning file	
	$weeklyPlanningContent = @"	
	#Weekly-Planning #planning
	
	# Weekly Planning for $($startOfWeek.ToString('yyyy-MM-dd')) to $($endOfWeek.ToString('yyyy-MM-dd'))	
	"@
	
	# Generate links to the daily journal files for the current week	
	for ($i = 0; $i -le 4; $i++) {	
	    $journalDate = $startOfWeek.AddDays($i)	
	    $journalLink = "# [[$($journalDate.ToString('yyyy-MM-dd')), $($journalDate.ToString('dddd'))]]"	
	    $weeklyPlanningContent += "$journalLink`n"	
	} 
	
	# Write the content to the weekly planning file	
	Set-Content -Path $weeklyPlanningFilePath -Value $weeklyPlanningContent
</code></pre>
It would have taken the Jim of Nov, 29 2022, a few hours to work that out. Now, it's not perfect.  There is a bug in the code, and I had to make a couple of other tweaks.

<aside>
As a mediocre coder, I am not at all threatened by what could seemingly be my own obsolescence. Like the joke goes "Hey, checkout this site I made - http://localhost:8000".  Like a you have to know what a here string is to identify one in a code block.
</aside>
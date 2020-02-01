# Pratchett guide

#### what is it for
The work has been done for 
[Data Visualization](https://www.coursera.org/learn/datavisualization/) course 
as a peer-graded programming assignment. 

Main purpose of it was to utilize 
[multidimensional scaling](https://en.wikipedia.org/wiki/Multidimensional_scaling) 
as it deeply inspired me.

Choosing a *data set* I decided to explore into the worlds 
created by [Sir Terence David John Pratchett](https://en.wikipedia.org/wiki/Terry_Pratchett) 
in his books.

When one just starts reading Pratchett it is usual not to follow 
chronological sequence since it does not have much sense and 
does not generally satisfy current passion; 
chronological order fits the second traverse more.

Frequent question a newbie reader asks is: 
*Which book should I take next?* 
There are so many directions to move: pick another book 
  - about interesting characters, 
  - from specific universe,
  - by themes vicinity or 
  - by mix of factors.

This visualization is intended to answer the question 
according to several heuristics.

#### implementation
Digging into Pratchett's books I've picked the following criteria 
to search similarities on:
 - universe where a story belongs,
 - storyline, as far as Terry Pratchett's worlds are too detailed to be uncovered from narrow angle,
 - main characters,
 - minor characters set,
 - leading themes,
 - co-authorship: was a book written in co-authorship or it is 'pure Pratchett'
 - literature form.

Having *305* remarkable characters and *~20* themes, 
each *data* (a book) is reflected as a point in *328-dimensional space*. 

Weighting similarities with different values 
(for example *1.7* for common universe, *0.3* for common minor character or 
*2.6* for common storyline) I calculate affinities between each pair of books 
and then, having affinities, get distances. 

Original visualization had been done in *presentation* format, but here
'storytelling' is affordable, so this edition allows a user 
to change weights for criteria and get different views on the same data set.

#### default picture 
In the default weights of choice preferences (highest weights) are given to 
common storyline and main characters.

Even experienced Pratchett fan can find interesting fact from the visualization. 
For example, the default picture   
 - surprisingly reveals how *Death* character dense through most of *Diskworld* 
 storylines, letting them stay relatively isolated at the same time; 
  - that *City Watch* storyline is not far from the rest of *Diskworld*, 
  but significantly decoupled. 
  - We see that *The Long Earth* series were written in co-authorship and, 
  together with *The Bromeliad Trilogy* and *Johnny Maxwell* storyline, 
  acting in some sort of real world, resides separately. 
  - We see also that *Pratchett* prefers *novels* and has only three books 
  without siblings.

#### library used
The picture implementation relies on 
awesome [D3js](https://d3js.org/). Annotations, controls and 
the rest of the page are done with [jQuery](https://jquery.com/).
Here is the precise list of third-party libraries exploited:
 - [d3 core](https://github.com/d3/d3)
 - [d3 selection](https://github.com/d3/d3-selection)
 - [d3 transition](https://github.com/d3/d3-transition)
 - [d3 axis](https://github.com/d3/d3-axis)
 - [d3 color](https://github.com/d3/d3-color)
 - [numeric](https://github.com/sloisel/numeric)
 - [jQuery](https://jquery.com/)

Cartograms 4 All
===
> UCSC CMPS 115 Summer 2017 Project

## Overview
> **Cartogram:** a map on which statistical information is shown in diagrammatic form - Google Search

Create a web application that allows anyone to upload their own dataset and create a cartogram from it. Furthermore,
users are able to share the cartograms they make.

At this time, our map accepts data for 4 different types of maps: the user has a choice between displaying data for
the 50 US states, 58 California counties, 14 Syria governorates, and 9 regions of what is commonly known as England,
not including Scotland, Wales, or Northern Ireland. The data should be properly formatted (more information below),
either in a sample CSV which we provide, or a custom CSV that the user uploads, and the map will do the rest of the work.
Columns may be selected, to show which value we consider when adjusting the map. We want users to be able to look at regionwide data,
bring it together, and visualize the overall trend in a click.

This is achieved by a physics-based force-reduction algorithm which expands or reduces map regions according to their
value in relation to each other, morphing data trends to be more intuitive to human eyes.
This takes the tedious manual inspection of numbered values and makes them visible in a novel way,
making clear trends that would otherwise be difficult to see.

## Team Members
|                    |                   |                   |
|--------------------|-------------------|-------------------|
| Luke Tanner        | Product Owner     | latanner@ucsc.edu |
| Jeff LaRocque      | Scrum Master - S2 | jslarocq@ucsc.edu |
| Michael Crane      | Scrum Master - S1 | mbcrane@ucsc.edu  |
| Casey Hillers      | Scrum Master - S1 | chillers@ucsc.edu |
| Jiayao Lin (Kevin) | Scrum Master - S3   | jlin53@ucsc.edu   |
| Ahmed Almutawa     | Scrum Master - S2   | aalmutaw@ucsc.edu |
## Technology

### Project Management
* Trello - Online scrum board
* Slack - Team communication
* Google Meet - For online scrum meetings
* GitHub - Software management
* Node Package Manager - Ensure dependencies are consistent between developers

### Programming Languages
* HTML
* SCSS
* Javascript

### Frameworks
* D3
* PapaParse
* TopoJSON
* Materialize.css

## Setting up the Project for Development
1. Have NPM set up on your system
2. `npm install`

Your system is now set up for development.

If you're working on the style of the site, run gulp in the main directory to have it autocompile your scss changes into the main stylesheet. Otherwise you will need to compile your changes manually before you can see their effect.

## File overview

css directory:
* style.css

scss directory:
* style.scss (to help with automation of browser styling)

data directory (including the 4 topojson maps for our available regions)
* nst_2011.csv (The default csv file, containing columns and information for various paramters)
* CAcountiesfinal.topojson
* SyriaGovernorates.topojson
* uk.topojson
* us-states.topojson

js directory:
* cartogram.js (The final version of the cartogram display function)
* cookie.js (utility to create cookies to mark user sessions)
* functions.js (helper functions for index.js)
* index.js (utility to feed csv fields to the cartogram drawing function)
* session.js (utility to save session ID's and store them on the server)
* topojson.js (dependency for map rendering and arc shaping)
* ui.js (New and improved buttons for users to upload or create csv files)

lib directory:
* index.html (Our main .html file, providing the webpage for the user to interact with)
* config files, and logo image.

example directory:
* CA census age projections directory (A realistically large dataset of projected California populations through 2060)
* CAcountyages55-59.csv (Sample CA population file)
* nst_2011.csv (Sample US data file)
* syria.csv (Sample Syria data file)
* uk.csv (Sample UK data file)

server directory:
* Various server functions to save and load session names

# To upload your own data:
Please make a note of the names displayed in the tooltips when hovering over sample maps. These are the official names
used in the .csv, so, if you wish to upload your own data, simply create a .csv file with rows named exactly
for each of these regions, and upload as many columns of data as you wish. If data does not exist for a certain region,
feel free to input 0, though be aware it may affect the visualization.

The most important thing: please make a header row in the format "NAME,data1,data2,..."

# A few more details on implementation:
The geospatial map lines are drawn from TopoJSON, an extension of GeoJSON with improved efficiency. TopoJSON's
efficiency partially stems from its ability to encode boundaries not of individual states, but simply of arcs
between states. This is essential for conveying statewide connections because we manipulate these arcs
by a physics-based force reduction algorithm to expand and contract spaces between the arcs. d3 display paths
are then drawn from these arcs.
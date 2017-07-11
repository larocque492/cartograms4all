Cartograms 4 All
===
> UCSC CMPS 115 Summer 2017 Project

## Overview
> **Cartogram:** a map on which statistical information is shown in diagrammatic form - Google Search

Create a web application that allows anyone to upload their own dataset and create a cartogram from it. Furthermore,
users are able to share the cartograms they make.

At this time, our map accepts US map data by state. As such, data should be added for all 50 states, properly
formatted, either in an uploaded CSV or custom CSV, and the map will do the rest. Columns may be selected, to show
which value we consider when adjusting the map. We want users to be able to look at statewide data, bring it together,
and visualize the overall trend in a click.

This is achieved by the force-mass algorithm which expands or reduces states according to their numbered value, whatever
the parameter may be.

## Team Members
|                    |                   |                   |
|--------------------|-------------------|-------------------|
| Luke Tanner        | Product Owner     | latanner@ucsc.edu |
| Jeff Larocque      | Scrum Master - S2 | jslarocq@ucsc.edu |
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
2. `cd app && npm install && npm build && cd ..`

Your system is now set up for development.

If you're working on the style of the site, run gulp in the main directory to have it autocompile your scss changes into the main stylesheet. Otherwise you will need to compile your changes manually before you can see their effect.

## File overview

css directory:
* cartogram.css (various browser styling files)
* main.css (")
* normalize.css (")

data directory:
* nst_2011.csv (The default csv file, containing columns and information for various paramters)
* us-states.topojson (The topoJSON source map that we manipulate)

js directory:
* cartogram.js (The final version of the cartogram display function)
* functions.js (Helper functions)
* gaster.js (Helper function for map display?)
* index.js (utility to feed csv fields to the cartogram drawing function)
* newman.js (The defunct file not included in our main webpage from which cartogram.js was pulled and tweaked)
* plugins.js (Added to improve compatibility for browsers that lack consoles)
* ui.js (New and improved buttons for users to upload or create csv files)

lib directory:
* index.html (Our main .html file, providing the webpage for the user to interact with)
* config file, and place holder image.

# A few more details on implementation:
The geospatial map lines are drawn from TopoJSON, an extension of GeoJSON with improved efficiency. TopoJSON's
efficiency partially stems from its ability to encode boundaries not of individual states, but simply of arcs
between states. This is essential for conveying statewide connections because we manipulate these arcs
by a physics-based force reduction algorithm to expand and contract spaces between the arcs. d3 display paths
are then drawn from these arcs.

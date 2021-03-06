# Assignment 3: Creating Interactive Visualization Software

## Data

Data for this project comes from the Portal Project Teaching Database:

Ernest, Morgan; Brown, James; Valone, Thomas; White, Ethan P. (2015): Portal
Project Teaching Database. figshare.
https://dx.doi.org/10.6084/m9.figshare.1314459.v5

The original data (named `portal_combined.csv` in this repository) has been
filtered (using `portal.R`) to remove rows where weight or hindfoot length
measurements were missing. This significantly reduced the number of species
present in the data; many of the species that occurred were very rare and always
had missing data. The filtered data (`portal_NAs_removed.csv`) is what gets used
in the visualization.

## Viewing

The live visualization can be viewed at:
http://karawoo.com/INFX-598J-assignment-3/portal.html

Alternatively, download or clone this repository and run
`python -m SimpleHTTPServer 8888` (on a Mac) from within this directory, then 
open a browser and navigate to `http://localhost:8888/portal.html`.

## Assignment details

#### 1.  Describe the data domain and storyboard interactive visualization techniques you will use.

Start either by choosing a data domain or choosing the interactive visualization
techniques you will implement. Think about why the domain and the techniques are
a good match for one another. Then write a description of data domain and the
interactive visualization application you will build. The description should
include a storyboard of the interface/displays you will create. Be sure to
explain the features of your application. Most importantly you should explain
why the interaction techniques you will implement will be effective in the
context of your data domain. The goal of this exercise is to think through the
various concerns that go into the software implementation. This is why it is
important that you perform this task first, before actually building the
software.

#### 2. Implement your design.

Use the programming language and toolkit of your choice to implement your design
(though we strongly recommend using Javascript and D3). You may wish to spend
some time looking into the various toolkits that are available. I have listed
some of them at the end of this document. You are free to use any publicly
available language and toolkit. However, I would like you to submit a final
executable program that I can execute on my own on either a Mac OS X, or a
Windows machine. If this is a problem for you, please talk to me right away.

#### 3. Produce a final writeup.

Your final submission should include:

* The description with storyboards from part 1.
* A brief description of your final interactive visualization application.
* An explanation of changes between the storyboard and the final implementation.
* The bundled source code for your application, uploaded as a webpage or file
  (either a .zip or .tar.gz archive). Please ensure that the software submitted
  is in working order. If any special instructions are needed for building or
  running your software, please provide them.
* For submissions by groups of two, please also include a breakdown of how the
  work was split among the group members.
* Finally, please include a commentary on the development process, including
  answers to the following questions: Roughly how much time did you spend
  developing your application? What aspects took the most time?

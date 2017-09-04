
S.D. Peckham
Feb. 22, 2017

This repository has the source code for a cross-platform app (iOS, Android, browser) developed with the Ionic 2 framework.  Ionic 2 is based on Google's Angular 2.  This app uses standardized vocabulary terms for describing computational models from the Geoscience Standard Names (GSN) ontology (geostandardnames.org).

The current status of the app is that it is working and allows users to browse metadata for a handful of known models (for testing), or to enter new metadata for a known or new model.  It stores this metadata for the app on the device in a manner that persists between uses of the app.  All metadata is stored in a JSON data structure.  However, the app does not yet push or pull model metadata or ontology updates to the GSN server.  The next phase of development will focus on setting up a MEAN stack on the GSN server for communication with the app, and on setting up role-based authentication.

The app has not yet been made available in any app store.  However, the Ionic 2 development platform has an app in the app store called "Ionic View" that can be downloaded for free and then used to test apps that are under development.

In the "docs" folder there is a text file called "00_Ionic2_Cheat_Sheet_MacBook.txt" that describes how to install Ionic 2 and to perform various common tasks.  There is also a PowerPoint file in this folder that provides additional background information on the GSN, as well as screenshots of the app.

Note that Ionic 2 has notably been used by to develop the well-received "Flyover Country" app, developed on an EarthCube project.

In order to use the source code in this repo, you must first install Ionic 2 and then create a blank project on your computer called "mcm_app", which can be located in a directory in your home directory.   You can then replace the "src" folder in that blank project with the "src" folder in this repo.  To run the app in a browser or in a mobile device emulator, see instructions in the "cheat sheet" document.

There is a large collection of well-written tutorials for Ionic 2 available from Josh Morony that explain how to do various things with Ionic 2.


import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';

import { ModelList } from '../model-list/model-list';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})

export class Tutorial {

 @ViewChild('mySlider') slider: Slides;

 slides = [
    {
      title: "Welcome to the Docs!",
      description: "This short tutorial will help you get started using the <b>Model Component Metadata App</b>, which uses the <b>Geoscience Standard Names Ontology</b>. This app can be used to browse, learn about and compare geoscience models, or by a developer to provide <b>standardized metadata</b> for a model.  The app pulls and pushes information from/to the GSN ontology server at:<br> <center><b>geostandardnames.org</b> </center>",
      image: "assets/img/ESB_Logo_587x154_border.png",
      //image: "assets/img/ica-slidebox-img-1.png",
    },
    {
      title: "What is the Geoscience<br> Standard Names Ontology?",
      description: "The <b>Geoscience Standard Names Ontology</b> is a schema for describing computational models (and data sets) in a standardized way. It uses Semantic Web technologies and best practices (e.g. RDF, OWL, SKOS) to formalize the concepts needed to provide a <i>deep description</i> of a resource.  This information can then be used to discover, compare, use and connect geoscience resources into workflows.",
      image: "assets/img/ESB_Logo_587x154_border.png",
      //image: "assets/img/ica-slidebox-img-2.png",
    },
    {
      title: "Why do we need<br> Standard Names?",
      description: "There are a wide variety of computational models and data sets in use all over the world.  Unfortunately, they differ in a variety of ways and this makes it labor-intensive to connect them into workflows. For example, each has its own <b>internal vocabulary</b> for referring to its variables.  However, <b><i>automated interoperability</i></b> becomes possible once these are mapped to unambiguous, cross-domain, rule-based standard names.",
      image: "assets/img/ESB_Logo_587x154_border.png",
      //image: "assets/img/ica-slidebox-img-2.png",
    },
    {
      title: "The Eight Core Concepts<br> of the GSN Ontology",
      description: "The GSN Ontology is based on 8 core concepts or <i>entities</i> that are inter-related. These are <b>variables</b>, <b>objects</b>, <b>quantities</b>, <b>operations</b>, <b>processes</b>, <b>grids</b>, <b>assumptions</b> and science <b>domains</b>.  Objects and quantities are also considered fundamental in the International System of Quantities (ISO 80000).",
      image: "assets/img/ESB_Logo_587x154_border.png",
      //image: "assets/img/ica-slidebox-img-3.png",
    },
    {
      title: "Variable Names",
      description: "Variables are the fundamental currency of science.  Values of variables are what scientists measure and save in data sets of all kinds.  They are the inputs and outputs of predictive models and the items exchanged between coupled models.  They also appear in the equations that summarize our scientific knowledge.  But what are they?  Variables are symbols, names or labels that refer to the pairing of an object and one of its attributes.",
      image: "assets/img/ESB_Logo_587x154_border.png",
      //image: "assets/img/ica-slidebox-img-3.png",
    },
    {
      title: "Object Names",
      description: "In our context, an <b>object</b> is any physical <i>thing</i> that we can observe (body, substance, etc.). We are often interested in a particular part of something larger, or an object contained in another object.  For context and alphabetical grouping, it is therefore helpful to use hierarchical <i>object names</i>. Objects may have both numerical and string attributes.  In the GSN, a word after a tilde '~' in an object name is an adjective.",
      image: "assets/img/ESB_Logo_587x154_border.png",
      //image: "assets/img/ica-slidebox-img-3.png",
    },
    {
      title: "Quantity Names",
      description: "A <b>quantity</b> is an attribute of an object that has a numerical value.  It will often have measurement units but can also be <b>dimensionless</b> (e.g. [m/m]).  It may be represented as a <b>scalar</b>, <b>vector</b> or <b>tensor</b>.  Many distinct quantities may have the same <b>root quantity</b>, such as <i>constant</i>, <i>exponent</i> and <i>angle</i>. Good quantity names are <i>object free</i> and can then be applied to many different objects.",
      // ###### For example, <i>volume flow rate</i> is preferable to <i>streamflow</i>.
      image: "assets/img/ESB_Logo_587x154_border.png",
      //image: "assets/img/ica-slidebox-img-3.png",
    },
    {
      title: "Operation Names",
      description: "When a mathematical <b>operation</b> is applied to a quantity it simply creates a new quantity, often with new units.  So quantity names may contain zero, one or a chain of operations.  In the GSN, all operation names end in the word <b>of</b>.  Examples include: <i>time_derivative_of</i>, <i>area_integral_of</i>, <i>x_component_of</i>, <i>log_of</i> and <i>divergence_of</i>.",
      image: "assets/img/ESB_Logo_587x154_border.png",
      //image: "assets/img/ica-slidebox-img-3.png",
    },
    {
      title: "Process Names",
      description: "A <b>process</b> is an action that an object can do or that can happen to it.  For example, a glacier can advance, calve, melt, sublimate, slide, or deform.  Process names are nouns derived from verbs.  E.g. water can infiltrate into soil, and this process is called <b><i>infiltration</i></b>.",
      image: "assets/img/ESB_Logo_587x154_border.png",
      //image: "assets/img/ica-slidebox-img-3.png",
    },
    {
      title: "Grids",
      description: "Variables can be associated with a fixed location or can vary in space and time, such as temperature within a room.  As appropriate, they may then be treated as scalar, vector or tensor fields.  A <b>grid</b> is a subdivision or <i>discretization</i> of space into <i>grid cells</i>.  Grids for geospatial variables require geo-referencing with ellipsoids, datums and map projections.",
      image: "assets/img/ESB_Logo_587x154_border.png",
      //image: "assets/img/ica-slidebox-img-3.png",
    },
    {
      title: "Assumption Names",
      description: "In the GSN ontology, the term <b>assumption</b> is used broadly to refer to any type of <i>qualifier</i>, such as a simplification, limitation, convention, exclusion, condition, approximation, clarification or restriction.  Scientists refer to assumptions with standard phrases, such as <b><i>incompressible flow</i></b>. Any of the other 7 entities in the GSN can be tagged and qualified with an assumption.",
      image: "assets/img/ESB_Logo_587x154_border.png",
      //image: "assets/img/ica-slidebox-img-3.png",
    },
    {
      title: "Relationships between the<br> Core Concepts",
      description: "Models can have Objects, Assumptions and (science) Domains.  Objects can have Quantities, Processes and Assumptions. Quantities can have Grids and Assumptions. Processes can have Assumptions.  Operations act on Quantities to create new ones.",
      image: "assets/img/ESB_Logo_587x154_border.png",
      //image: "assets/img/ica-slidebox-img-3.png",
    },
    {
      title: "Context-specific Help",
      description: "Whenever you see a button with the Wikipedia <b><i>W</i></b> symbol, you can press it to view more information on that item in a browser window.  Buttons with a lower-case letter <b><i>i</i></b> in a circle also provide information.",
      image: "assets/img/ESB_Logo_587x154_border.png",
      //image: "assets/img/ica-slidebox-img-3.png",
    }
  ];


  constructor(public navCtrl: NavController) {
    // console.log("slider = " + this.slider );
  }


  showNextSlide(){
    this.slider.slideNext();
  }


  showPrevSlide(){
    this.slider.slidePrev();
  }


  leaveTutorial(){
     this.navCtrl.push( ModelList );
  }


  ionViewDidLoad() {
    console.log('Hello Tutorial Page');
  }

}






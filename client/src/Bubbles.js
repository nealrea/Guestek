import React, { Component } from 'react';
import './App.css';
import { select } from 'd3-selection'
import { forceSimulation } from 'd3-force';
import { forceManyBody } from 'd3-force';
import { forceCenter } from 'd3-force';
import { forceCollide } from 'd3-force';
import { forceX } from 'd3-force';
import { forceY } from 'd3-force';
import { scaleLinear } from 'd3-scale';
import { scaleLog } from 'd3-scale';
import { scaleSqrt } from 'd3-scale';
import { scaleBand } from 'd3-scale';
import { extent } from 'd3-array';
import { max } from 'd3-array';
import chroma from 'chroma-js';
//import _ from 'lodash';


var guests = [];
var itemsOrdered = {};
var groupByVisits = false;
var displayGuestView = false;
var width = 1200;
var height = 550;
var ttFontSize = 20;

//var xScale = scaleBand().domain(['neal','anna','nolan','manisha','marshall','jim','john','daisy','peter','joe']).range([20,1180]);
var xScale = scaleBand().domain([0,1,2,3])
	.range([0,800])
	.rangeRound([0,width])
	.paddingOuter(0.03);
var colorScale = chroma.scale(['0EEF00','00095F']);
var amountScale = scaleSqrt();
var charge = 125;
var simulation = forceSimulation()
	.stop();

class Bubbles extends Component {
	constructor(props) {
		super(props);
		this.forceTick = this.forceTick.bind(this);
		simulation.on('tick', this.forceTick);
	}

	componentWillReceiveProps(nextProps) {
		//console.log('received props');
		console.log(nextProps);
		guests = nextProps.data;
		groupByVisits = nextProps.groupByVisits;
		displayGuestView = nextProps.displayGuestView;
	};

    componentWillMount() {
    	
    }

    componentDidMount() {
    	//console.log('mounted');
    	this.container = select(this.refs.container);
    	this.hover = select(this.refs.container).append('g');
    	this.hover.append('rect')
    		.attr('height', 45)
    		.attr('width', 100)
    		.attr('opacity', 0.85)
      		.attr('fill', 'none');
	    this.hover.append('text')
	    	.attr('text-anchor', 'middle')
      		.attr('dy', '1.5em')
      		//.attr('dx', '6em')
    		.attr('fill', 'black')
    		.style('font-size', ttFontSize);
    }

    componentDidUpdate() {
    	//console.log('updated');
    	var oneCent = 0.01;
    	var maxSpent = max(guests, d => d.totalSpent);
    	//var totalSpentExtent = extent(guests, d => d.totalSpent);
		amountScale.domain([0.01, maxSpent]);
    	
    	this.renderCircles();

    	guests.forEach(guest => {
			var xDom;
			if(guest.numVisits >= 75)
				xDom = 3;
			else if(guest.numVisits >= 50)
				xDom = 2;
			else if(guest.numVisits >= 25)
				xDom = 1;
			else
				xDom = 0;
			guest.focusX = xScale(xDom);
		}) 

		simulation.force('collide', forceCollide(d => amountScale(d.totalSpent)*charge).strength(0.5));
		simulation.force('center', forceCenter(width / 2, height / 2));
    	simulation.nodes(guests).alpha(0.9).restart();

    	//groups bubbles by numVisits
    	if(groupByVisits){
    		//console.log('splitting bubbles');
    		this.byNumVisits();
    	}else{
    		//console.log('merging bubbles')
    		simulation.force('x', forceX(d => width/2));
			simulation.force('y', forceY(height/2));
			simulation.restart();
    	}
    }

    byNumVisits() {
		simulation.force('x', forceX(d => d.focusX));
		simulation.force('y', forceY(height/2));
		simulation.restart();
    }

    loadItemsOrdered = (query) => {
    	var res = fetch('/api/itemsOrdered/loadItemsOrdered?query=' + query)
    		.then(res => res.json()).catch(err => console.log(err));
    	console.log(res);
    	return res;
    }

    renderCircles() {
    	//draw guest circles
    	this.circles = this.container.selectAll('circle')
    		.data(guests, d => d.id);

    	//exit
    	this.circles.exit().remove();

    	//enter+update
    	this.circles = this.circles.enter().append('circle')
    		.attr('fill-opacity', 0.25)
    		.attr('stroke-width', 2)
    		.merge(this.circles)
    		.attr('r', d => amountScale(d.totalSpent)*charge)
    		.attr('fill', d => colorScale(amountScale(d.totalSpent)))
    		.attr('stroke', d => colorScale(amountScale(d.totalSpent)))
    		.on('mouseover', d => this.mouseOver(d))
    		.on('mouseleave', d => this.mouseLeave(d))
    		.on('click', d => this.mouseClick(d));
    }

    mouseOver(d) {
    	var currCircle = this.circles.filter(p => {
    		if(p === d){
    			return p;
    		}
    	})
    	currCircle.attr('stroke', 'black')
    		.attr('stroke-width', 3);

    	var capitalize = name => {
    		return name[0].toUpperCase() + name.substr(1);
    	}

    	this.hover.style('display', 'block');
    	if(groupByVisits){
    		//puts tooltip right below center of bubble
    		this.hover.attr('transform', 'translate(' + [d.x, 60] + ')');
    	}else{
    		this.hover.attr('transform', 'translate(' + [d.x, 425] + ')');
    	}
    	this.hover.select('text')
    		.text(capitalize(d.firstName) + " " + capitalize(d.lastName) + " - $" + d.totalSpent.toFixed(2));
    	var width = this.hover.select('text').node().getBoundingClientRect().width;
   	 	this.hover.select('rect')
      		.attr('width', width + 6)
      		.attr('x', -width / 2 - 3)
      		.attr('fill', '#FF988B');
    }

    mouseLeave(d) {
    	var currCircle = this.circles.filter(p => {
    		if(p === d){
    			return p;
    		}
    	})
    	currCircle.attr('stroke', colorScale(amountScale(d.totalSpent)))
    		.attr('stroke-width', 2);

    	this.hover.style('display', 'none')
    }

    mouseClick(d) {
    	//sets state to switch to guest view
    	this.props.clickGuest();
    	console.log(d);
    	itemsOrdered = this.loadItemsOrdered(d.id);
    }

    forceTick() {
    	//console.log(simulation.force);
    	this.circles
    		.attr('cx', d => d.x)
    		.attr('cy', d => d.y);
    }



	render() {
		if(displayGuestView)
			return <h1>add code here to render single guest information (i.e. items ordered, sized by frequency...)</h1>;
		else
	      	return (
	      		<div className='bubbleChart'>
		      		<svg ref='container' width={width} height={height}></svg>
	      		</div>
	      	);
   }
}
export default Bubbles;
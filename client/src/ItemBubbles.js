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
import { scalePow } from 'd3-scale';
import { scaleBand } from 'd3-scale';
import { extent } from 'd3-array';
import { max } from 'd3-array';
import chroma from 'chroma-js';
//import _ from 'lodash';


var itemsOrdered = [];
var items = [];
var groupByVisits = false;
var displayGuestView = true;
var width = 1200;
var height = 550;
var ttFontSize = 20;

var xScale = scaleBand().domain([0,1,2,3])
	.range([0,800])
	.rangeRound([0,width])
	.paddingOuter(0.03);
var colorScale = chroma.scale(['0EEF00','00095F']);
var priceScale = scaleLog();
var frequencyScale = scaleLog();
var charge = 75;
var simulation = forceSimulation()
	.stop();

class ItemBubbles extends Component {
	constructor(props) {
		super(props);
		this.forceTick = this.forceTick.bind(this);
		simulation.on('tick', this.forceTick);
	}

	componentWillReceiveProps(nextProps) {
		console.log('received props');
		console.log(nextProps);
		itemsOrdered = nextProps.data;
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

    shouldComponentUpdate() {
        if(itemsOrdered.length === 0)
            return false;
        else
            return true;
    }

    componentDidUpdate() {
    	//console.log('updated');
        var priceRange = extent(itemsOrdered, d => d.price);
    	var maxFrequency = max(itemsOrdered, d => d.timesOrdered);
        priceScale.domain(priceRange)
		frequencyScale.domain([1, 1000]);
    	
    	this.renderCircles();

    	/*guests.forEach(guest => {
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
		}) */

		simulation.force('collide', forceCollide(d => frequencyScale(d.timesOrdered) * charge).strength(0.5));
		simulation.force('center', forceCenter(width / 2, height / 2));
    	simulation.nodes(itemsOrdered).alpha(0.9).restart();

        /*
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
        */
        simulation.force('x', forceX(d => width/2));
        simulation.force('y', forceY(height/2));
        simulation.restart();
    }
/*
    byNumVisits() {
		simulation.force('x', forceX(d => d.focusX));
		simulation.force('y', forceY(height/2));
		simulation.restart();
    }
*/
    renderCircles() {
        console.log(itemsOrdered);
    	//draw item circles
    	this.circles = this.container.selectAll('circle')
    		.data(itemsOrdered, d => d.id);

        console.log(this.circles);
    	//exit
    	this.circles.exit().remove();

    	//enter+update
    	this.circles = this.circles.enter().append('circle')
    		.attr('fill-opacity', 0.25)
    		.attr('stroke-width', 2)
    		.merge(this.circles)
    		.attr('r', d => frequencyScale(d.timesOrdered)*charge)
    		.attr('fill', d => colorScale(priceScale(d.price)))
    		.attr('stroke', d => colorScale(priceScale(d.price)))
    		.on('mouseover', d => this.mouseOver(d))
    		.on('mouseleave', d => this.mouseLeave(d));
    		//.on('click', d => this.mouseClick(d));

        console.log(this.circles);
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
        /*
    	if(groupByVisits){
    		//puts tooltip right below center of bubble
    		this.hover.attr('transform', 'translate(' + [d.x, 60] + ')');
    	}else{
    		this.hover.attr('transform', 'translate(' + [d.x, 425] + ')');
    	}
        */
        this.hover.attr('transform', 'translate(' + [d.x, 60] + ')');
    	this.hover.select('text')
    		.text(capitalize(d.name) +  " - $" + d.price.toFixed(2));
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
    	currCircle.attr('stroke', colorScale(priceScale(d.price)))
    		.attr('stroke-width', 2);

    	this.hover.style('display', 'none')
    }
/*
    mouseClick(d) {
    	//sets state to switch to guest view
    	this.props.clickGuest();
    	console.log(d);
    	this.renderItemsCircles(d.id);
    	//itemsOrdered = this.loadItemsOrdered(d.id);
    	console.log(this.itemCircles);

    }
*/
    forceTick() {
    	this.circles
    		.attr('cx', d => d.x)
    		.attr('cy', d => d.y);
    }



	render() {
		if(!displayGuestView)
			return null;
		else
	      	return (
	      		<div className='bubbleChart'>
		      		<svg ref='container' width={width} height={height}></svg>
	      		</div>
	      	);
   }
}
export default ItemBubbles;
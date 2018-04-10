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
var groupByVisits = false;
var width = 1200;
var height = 600;
var ttFontSize = 20;

var xScale = scaleBand().domain(['neal','anna','nolan','manisha','marshall','jim','john','daisy','peter','joe']).range([20,1180]);
var colorScale = chroma.scale(['0EEF00','00095F']);
var amountScale = scaleSqrt();
var simulation = forceSimulation()
	.force('center', forceCenter(width / 2, height / 2))
	//.force('charge', forceManyBody(-100))
	.stop();

class Bubbles extends Component {
	constructor(props) {
		super(props);
		this.forceTick = this.forceTick.bind(this);
		simulation.on('tick', this.forceTick);
	}

	componentWillReceiveProps(nextProps) {
		console.log('received props');
		guests = nextProps.data;
		groupByVisits = nextProps.groupByVisits;
	};

    componentWillMount() {
    	
    }

    componentDidMount() {
    	console.log('mounted');
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
    	console.log('updated');
    	var oneCent = 0.01;
    	var maxSpent = max(guests, d => d.totalSpent);
    	//var totalSpentExtent = extent(guests, d => d.totalSpent);
		amountScale.domain([0.01, maxSpent]);
    	this.renderCircles();
    	//simulation.force('charge', forceManyBody().strength(d => -d.totalSpent));
    	simulation.force('collide', forceCollide(d => amountScale(d.totalSpent)*150).strength(0.05));
    	simulation.nodes(guests).alpha(0.9).restart();

    	console.log(groupByVisits);
    	//groups bubbles by numVisits
    	if(groupByVisits){
    		console.log('splitting bubbles');
    		this.byNumVisits();
    	}else{
    		console.log('merging bubbles')
    		simulation.force('x', forceX(d => width/2));
			simulation.force('y', forceY(height/2));
			simulation.restart();
    	}
    }

    byNumVisits() {
    	guests = guests.map(d => {
			d.focusX = xScale(d.firstName);
			return d;
		})

		simulation.force('x', forceX(d => d.focusX));
		simulation.force('y', forceY(height/2));
		simulation.restart();
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
    		.attr('r', d => amountScale(d.totalSpent)*150)
    		.attr('fill', d => colorScale(amountScale(d.totalSpent)))
    		.attr('stroke', d => colorScale(amountScale(d.totalSpent)))
    		.on('mouseover', d => this.mouseOver(d))
    		.on('mouseleave', () => this.hover.style('display', 'none'));
    }

    mouseOver(d) {

    	var capitalize = name => {
    		return name[0].toUpperCase() + name.substr(1);
    	}

    	this.hover.style('display', 'block');
    	//puts tooltip right below center of bubble
    	//this.hover.attr('transform', 'translate(' + [d.x, d.y + amountScale(d.totalSpent)] + ')');
    	this.hover.attr('transform', 'translate(' + [1000, 50] + ')');
    	this.hover.select('text')
    		.text(capitalize(d.firstName) + " " + capitalize(d.lastName) + " - $" + d.totalSpent.toFixed(2));
    	var width = this.hover.select('text').node().getBoundingClientRect().width;
   	 	this.hover.select('rect')
      		.attr('width', width + 6)
      		.attr('x', -width / 2 - 3)
      		.attr('fill', '#FF988B');
    }

    forceTick() {
    	//console.log(simulation.force);
    	this.circles
    		.attr('cx', d => d.x)
    		.attr('cy', d => d.y);
    }



	render() {
	      return (
	      	<svg width={width} height={height} ref='container'>

	      	</svg>
	      );
   }
}
export default Bubbles;
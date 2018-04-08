import React, { Component } from 'react';
import './App.css';
import { select } from 'd3-selection'
import { forceSimulation } from 'd3-force';
import { forceManyBody } from 'd3-force';
import { forceCenter } from 'd3-force';
import { forceCollide } from 'd3-force';
import { scaleLinear } from 'd3-scale';
import { scaleLog } from 'd3-scale';
import { extent } from 'd3-array';
import chroma from 'chroma-js';


var guests = [];
var width = 1000;
var height = 600;

var colorScale = chroma.scale(['0EEF00','00095F']);
var amountScale = scaleLinear();
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
		
	};

    componentWillMount() {
    	
    }

    componentDidMount() {
    	console.log('mounted');
    	this.container = select(this.refs.container);
    }

    componentDidUpdate() {
    	console.log('updated');
    	var totalSpentExtent = extent(guests, d => d.totalSpent);
		amountScale.domain(totalSpentExtent);
    	this.renderCircles();
    	//simulation.force('charge', forceManyBody().strength(d => -d.totalSpent));
    	simulation.force('collide', forceCollide(d => amountScale(d.totalSpent)*150).strength(0.05));
    	simulation.nodes(guests).alpha(0.9).restart();
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
    		.attr('stroke', d => colorScale(amountScale(d.totalSpent)));
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
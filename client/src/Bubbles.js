import React, { Component } from 'react';
import './App.css';
import { select } from 'd3-selection'
import { forceSimulation } from 'd3-force';
import { forceManyBody } from 'd3-force';
import { forceCenter } from 'd3-force';


var guests = [];
var width = 500;
var height = 500;
var simulation = forceSimulation()
	.force('center', forceCenter(width / 2, height / 2))
	.force('charge', forceManyBody)
	.stop();

class Bubbles extends Component {
	constructor(props) {
		super(props);
		this.forceTick = this.forceTick.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		console.log('received props');
		guests = nextProps.data;
		
	};

    componentWillMount() {
    	simulation.on('tick', this.forceTick);
    }

    componentDidMount() {
    	console.log('mounted');
    	this.container = select(this.refs.container);
    }

    componentDidUpdate() {
    	console.log('updated');
    	this.renderCircles();
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
    		.merge(this.circles)
    		.attr('r', d => d.totalSpent)
    		.attr('opacity', 0.5);
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
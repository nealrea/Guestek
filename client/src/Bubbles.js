import React, { Component } from 'react';
import './App.css';
import { forceSimulation } from 'd3-force';

class Bubbles extends Component {
	constructor(props){
		super(props);
		this.createBubbleChart = this.createBubbleChart.bind(this);
	};

	createBubbleChart() {
		var simulation = forceSimulation()
			.velocityDecay(0.2);
	};

	render() {
		return(
			<svg>
			</svg>
		);
	};
}

export default Bubbles;
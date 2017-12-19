import React from 'react';
import * as _ from 'underscore';
import { format } from 'd3-format';
import { extent, max } from 'd3-array';
// import { scaleOrdinal } from 'd3-scale';
// import { AnnotationLabel } from 'react-annotation';

// import { VictoryBar, VictoryChart } from 'victory';
// import { ResponsiveORFrame } from 'semiotic';
import { ScaleSVG } from '@vx/responsive';
import { Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { scaleOrdinal, scaleBand, scaleLinear } from '@vx/scale';

import '../styles/Chart.css';

const color = scaleOrdinal({
	domain: ['1_neighborhood', '2_city', '3_region', '4_state'],
	range: ['#68707c', '#9f9f9f', '#9f9f9f', '#9f9f9f']
});

const percent = (x) => format('.0%')(x);

const margin = { left: 135, top: 30, bottom: 50, right: 40 };

export default class Chart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hovered: ''
		};
		this.handleClick = props.handleClick.bind(this);
	}

	colorNeighborhood = (d) => {
		return d.neighborhood === this.props.hood ? '#0868ac' : color(d.geoType);
	};

	handleHover = (d) => {
		let hovered = d === undefined ? '' : d.neighborhood;
		this.setState({
			hovered: hovered
		});
	};

	makeTooltip = (bar) => {
		if (bar) {
			console.log(bar);
			let displayVal = bar.d.displayVal;
			return (<text><tspan>{displayVal}</tspan></text>);
		}
	};

    render() {

		let data = this.props.data;
		let width = this.props.width;
		let height = this.props.height;
		let innerWidth = width - margin.left - margin.right;
		let innerHeight = height - margin.top - margin.bottom;

		const neighborhood = (d) => d.neighborhood;
		const value = (d) => +d.value;

		let xscale = scaleLinear({
			range: [0, innerWidth],
			domain: [0, max(data, value)],
			// nice: true
		});

		let yscale = scaleBand({
			rangeRound: [0, innerHeight],
			domain: data.map(neighborhood),
			padding: 0.2,
		});

		return (
			<div className="Chart">
				<ScaleSVG width={width} height={height}>
					<Group top={margin.top} left={margin.left}>
						{data.map((d, i) => {
							let barLength = xscale(value(d));
							return (
								<Group key={`bar-${neighborhood(d)}`}>
									<Bar
										height={yscale.bandwidth()}
										width={barLength}
										y={yscale(neighborhood(d))}
										x={0}
										fill={ this.colorNeighborhood(d) }
										data={{ x: value(d), y: neighborhood(d) }}
										className="bar"
										onClick={data => e => this.handleClick(data)}
									/>
								</Group>
							)
						})}
						<AxisLeft
							hideAxisLine={true}
							hideTicks={true}
							scale={yscale}
							tickLabelProps={(val, i) => ({
								dy: '0.3em',
								fontFamily: 'Barlow Semi Condensed',
								textAnchor: 'end'
							})}
							className="axis"
						/>
						<AxisBottom
							scale={xscale}
							top={innerHeight}
							tickLabelProps={(val, i) => ({
								fontFamily: 'Barlow Semi Condensed',
								textAnchor: 'middle'
							})}
							tickFormat={percent}
							numTicks={5}
							className="axis"
						/>
					</Group>
				</ScaleSVG>
			</div>
		);
    }
}

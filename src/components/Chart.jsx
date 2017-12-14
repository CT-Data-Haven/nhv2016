import React from 'react';
import * as _ from 'underscore';
import { format } from 'd3-format';
import { scaleOrdinal } from 'd3-scale';
import { AnnotationLabel } from 'react-annotation';

// import { VictoryBar, VictoryChart } from 'victory';
import { ResponsiveORFrame } from 'semiotic';

import '../styles/Chart.css';

const color = scaleOrdinal()
	.domain(['1_neighborhood', '2_city', '3_region'])
	.range(['#666', '#9f9f9f', '#9f9f9f']);

const margin = { left: 125, top: 30, bottom: 50, right: 40 };

export default class Chart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hovered: ''
		};
	}

	colorNeighborhood = (d) => {
		return {
			// fill: d.neighborhood === this.props.hood ? '#0868ac' : '#555',
			fill: d.neighborhood === this.props.hood ? '#0868ac' : color(d.geoType),
			opacity: 0.8
		};
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
		let axis = {
			orient: 'bottom',
			tickFormat: d => format('.0%')(d),
			className: 'percent-axis',
			ticks: 4
		};
		let annotations = _.chain(data)
			.filter((d) => d.neighborhood === this.state.hovered)
			.each((d) => {
				d.type = AnnotationLabel;
				d.title = d.neighborhood;
				d.label = d.displayVal;
				d.align = 'middle';
				d.end = 'none';
				d.dx = 30;
				d.dy = 0;
			})
			.value();

        return (
            <div className="Chart">
				<ResponsiveORFrame
					size={this.props.size}
					data={data}
					axis={axis}
					responsiveWidth={true}
					responsiveHeight={false}
					projection={'horizontal'}
					renderKey={ d => d.neighborhood }
					type={'bar'}
					style={ this.colorNeighborhood }
					oAccessor={ d => d.neighborhood }
					rAccessor={ d => d.value }
					oLabel={true}
					oPadding={3}
					pieceClass={'bar'}
					pieceHoverAnnotation={true}
					customClickBehavior={this.props.handleClick}
					customHoverBehavior={this.handleHover}
					// svgAnnotationRules={this.makeTooltip}
					tooltipContent={ d => (<span></span>) }
					annotations={annotations}
					margin={margin}
				/>
			</div>
        );
    }
}

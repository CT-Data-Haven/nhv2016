import React from 'react';
import { Mercator } from '@vx/geo';
import { ScaleSVG } from '@vx/responsive';
import { LegendThreshold } from '@vx/legend';
import * as topojson from 'topojson-client';
import { Tooltip, Overlay } from 'react-bootstrap';
import { format } from 'd3-format';

import topology from './nhv_shape_topo.json';
import '../styles/CityMap.css';

const center = [-72.9290959, 41.2982884];
const shape = topojson.feature(topology, topology.objects.nhv_shape);

export default class CityMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tipString: '',
			hovering: false,
			target: null
		};
		this.showTooltip = this.showTooltip.bind(this);
		this.hideTooltip = this.hideTooltip.bind(this);
	}

	updateColor = (geography) => {
		let name = geography.properties.Neighborhood;
		return this.props.data[name] ? this.props.color(this.props.data[name].value) : '#ccc';
	};

	showTooltip = (geography, event) => {
		let name = geography.properties.Neighborhood;
		let string = this.props.data[name] ? `${name}: ${this.props.data[name].displayVal}` : `${name}: N/A`;
		this.setState({
			tipString: string,
			hovering: true,
			target: event.target
		});
	};

	hideTooltip = () => {
		this.setState({
			hovering: false
		});
	};

	percentFormat(label) {
		return label ? format('.0%')(label) : '';
	}

	render() {
		let width = this.props.width;

		return (
			<div className="CityMap">
				<Overlay
					show={this.state.hovering}
					target={this.state.target}
					container={this}
					containerPadding={4}
					placement="top"
				>
					<Tooltip id="mapTooltip">{this.state.tipString}</Tooltip>
				</Overlay>
				<ScaleSVG width={width} height={width}>
					<Mercator
						data={shape.features}
						scale={210000}
						center={center}
						translate={[ width / 2, width / 2 ]}
						stroke={'#777'}
						fill={this.updateColor}
						onClick={(geography) => (event) => {
							this.props.handleClick(geography);
						}}
						onMouseEnter={(geography) => (event) => {
							this.showTooltip(geography, event);
						}}
						onMouseLeave={(geography) => (event) => {
							this.hideTooltip();
						}}
					/>


				</ScaleSVG>
				<div className="legend-container">
					<LegendThreshold
						scale={this.props.color}
						direction="column"
						itemDirection="row"
						labelMargin="2px 0 0 10px"
						shapeMargin="1px 0 0"
						labelFormat={this.percentFormat}
					/>
				</div>

			</div>
		);
	}
}

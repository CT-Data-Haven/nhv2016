import React from 'react';
import { Mercator } from '@vx/geo';
import { ScaleSVG } from '@vx/responsive';
import { LegendThreshold } from '@vx/legend';
import * as topojson from 'topojson-client';
import { format } from 'd3-format';
import Tooltip from 'react-portal-tooltip';

import topology from './nhv_shape_topo.json';
import '../styles/CityMap.css';

const center = [-72.9290959, 41.2982884];
const shape = topojson.feature(topology, topology.objects.nhv_shape);

const tipStyle = {
	style: {
		background: '#333',
		opacity: 0.85,
		boxShadow: 0,
		color: 'white',
		fontFamily: 'Barlow',
		fontSize: '0.9em'
	},
	arrowStyle: {
		color: '#333',
		opacity: 0.85,
		borderColor: false
	}
};

export default class CityMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tipString: '',
			hovering: false,
			hoverOver: 'path-amity'
		};
		this.showTooltip = this.showTooltip.bind(this);
		this.hideTooltip = this.hideTooltip.bind(this);
	}

	updateColor = (geography) => {
		let name = geography.properties.Neighborhood;
		return this.props.data[name] ? this.props.color(this.props.data[name].value) : '#ccc';
	};

	makeId = (geography) => {
		let name = geography.properties.Neighborhood.toLowerCase().replace(/\W/gi, '');
		return `path-${name}`;
	};

	showTooltip = (geography, event) => {
		let name = geography.properties.Neighborhood;
		let string = this.props.data[name] ? `${name}: ${this.props.data[name].displayVal}` : `${name}: N/A`;
		let id = `path-${name.toLowerCase().replace(/\W/gi, '')}`;
		this.setState({
			tipString: string,
			hovering: true,
			hoverOver: id
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
			<div className="CityMap" id="map">
				<ScaleSVG width={width} height={width}>
					<Mercator
						data={shape.features}
						id={this.makeId}
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

				<Tooltip
					active={this.state.hovering}
					position="top"
					arrow="center"
					parent={`#${this.state.hoverOver}`}
					style={tipStyle}
					tooltipTimeout={300}
				>
					<div className="tooltip-content">{this.state.tipString}</div>
				</Tooltip>
			</div>
		);
	}
}

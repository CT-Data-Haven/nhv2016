import React from 'react';
import { Mercator } from '@vx/geo';
import { ScaleSVG } from '@vx/responsive';
import { LegendThreshold } from '@vx/legend';
import * as topojson from 'topojson-client';
import { format } from 'd3-format';
import Tooltip from 'react-portal-tooltip';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import Legend from './Legend';

import topology from './nhv_shape_topo.json';
import '../styles/CityMap.css';

const center = [-72.9290959, 41.2982884];
const b = topojson.bbox(topology);
const bbox = [[ b[1], b[0] ], [ b[3], b[2] ]];
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
	updateColor = (geography) => {
		let name = geography.properties.Neighborhood;
		let color = this.props.data[name] ? this.props.color(this.props.data[name].value) : '#ccc';

		return {
			fillColor: color,
			color: '#eee',
			weight: 1,
			opacity: 1,
			fillOpacity: 0.8
		};
	};

	// makeId = (geography) => {
	// 	let name = geography.properties.Neighborhood.toLowerCase().replace(/\W/gi, '');
	// 	return `path-${name}`;
	// };

	// showTooltip = (geography, event) => {
	// 	let name = geography.properties.Neighborhood;
	// 	let string = this.props.data[name] ? `${name}: ${this.props.data[name].displayVal}` : `${name}: N/A`;
	// 	let id = `path-${name.toLowerCase().replace(/\W/gi, '')}`;
	// 	this.setState({
	// 		tipString: string,
	// 		hovering: true,
	// 		hoverOver: id
	// 	});
	// };
    //
	// hideTooltip = () => {
	// 	this.setState({
	// 		hovering: false
	// 	});
	// };
    //
	// onEachFeature = (feature, layer) => {
    //
	// };
	onEachFeature = (feature, layer) => {
		let name = feature.properties.Neighborhood;

		layer.on('click', this.props.handleClick)
			.on('mouseover', this.addHilite)
			.on('mouseout', this.removeHilite);
		layer.bindTooltip(() => {
			let data = this.props.data[name];
			return this.props.data[name] ? `${name}: ${this.props.data[name].displayVal}` : `${name}: N/A`;
		}, { direction: 'top', offset: [0, -20], className: 'custom-tip' });
	};

	addHilite = (e) => {
		e.target.setStyle({
			fillOpacity: 1,
			weight: 1
		}).bringToFront();
	};

	removeHilite = (e) => {
		e.target.setStyle({
			fillOpacity: 0.8,
			weight: 0.5
		});
	};

	percentFormat(label) {
		return label ? format('.0%')(label) : '';
	}

	render() {
		let width = this.props.width;

		return (
			<div className="CityMap" id="map">
				<Map
					bounds={bbox}
					scrollWheelZoom={false}
					zoomSnap={0.25}
					zoomDelta={0.25}
				>
					<TileLayer
						// url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png"
						url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.{ext}"
						attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
						subdomains='abcd'
						minZoom={0}
						maxZoom={20}
						ext='png'
					/>
					<GeoJSON
						data={shape}
						key={(feature) => feature.properties.Neighborhood}
						style={this.updateColor}
						onEachFeature={this.onEachFeature}
					/>
				</Map>
				<Legend colorscale={this.props.color} />
			</div>
		);
	}
}

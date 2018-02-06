import React from 'react';
import * as topojson from 'topojson-client';
import { format } from 'd3-format';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import Legend from './Legend';

import topology from './nhv_shape_topo.json';
import '../styles/CityMap.css';

const b = topojson.bbox(topology);
const bbox = [[ b[1], b[0] ], [ b[3], b[2] ]];
const shape = topojson.feature(topology, topology.objects.nhv_shape);
const blob = topojson.merge(topology, topology.objects.nhv_shape.geometries);

export default class CityMap extends React.Component {
	updateColor = (geography) => {
		let name = geography.properties.Neighborhood;
		let color = this.props.data[name] ? this.props.color(this.props.data[name].value) : '#ccc';

		return {
			fillColor: color,
			color: '#eee',
			weight: 1,
			opacity: 1,
			fillOpacity: 0.75
		};
	};

	onEachFeature = (feature, layer) => {
		let name = feature.properties.Neighborhood;

		layer.on('click', this.props.handleClick)
			.on('mouseover', this.addHilite)
			.on('mouseout', this.removeHilite);
		layer.bindTooltip(() => {
			return this.props.data[name] ? `${name}: ${this.props.data[name].displayVal}` : `${name}: N/A`;
		}, { direction: 'top', offset: [0, -20], className: 'custom-tip' });
	};

	addHilite = (e) => {
		e.target.setStyle({
			fillOpacity: 0.95,
			weight: 1
		});
		// .bringToFront();
	};

	removeHilite = (e) => {
		e.target.setStyle({
			fillOpacity: 0.75,
			weight: 0.5
		});
	};

	percentFormat(label) {
		return label ? format('.0%')(label) : '';
	}

	render() {
		return (
			<div className="CityMap" id="map">
				<Map
					bounds={bbox}
					scrollWheelZoom={false}
					zoomSnap={0.25}
					zoomDelta={0.25}
				>
					<TileLayer
						url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.{ext}"
						attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
						subdomains='abcd'
						minZoom={0}
						maxZoom={20}
						ext='png'
						opacity={0.4}
					/>
					<GeoJSON
						data={shape}
						key={(feature) => feature.properties.Neighborhood}
						style={this.updateColor}
						onEachFeature={this.onEachFeature}
					/>
					<GeoJSON
						data={blob}
						style={{
							fillColor: 'transparent',
							color: '#333',
							weight: 1.5,
							pointerEvents: 'none'
						}}
						interactive={false}
					/>
				</Map>
				<Legend colorscale={this.props.color} />
			</div>
		);
	}
}

import React from 'react';
import { ComposableMap, ZoomableGroup, Geographies, Geography } from 'react-simple-maps';
import ReactTooltip from 'react-tooltip';
import '../styles/CityMap.css';

const options = {
	projection: 'mercator',
	projectionConfig: {
		scale: 200000
	}
};

const baseStyle = {
	stroke: '#999',
	strokeWidth: 0.5,
	// outline: 'none',
	// fillOpacity: 1
};

const center = [-72.9290959, 41.2982884];

export default class CityMap extends React.Component {
	componentDidMount() {
		setTimeout(() => ReactTooltip.rebuild(), 100);
	}

	updateColor(name) {
		return this.props.data[name] ? this.props.color(this.props.data[name].value) : '#ccc';
	}

	updateTooltip(name) {
		return this.props.data[name] ? `${name}: ${this.props.data[name].displayVal}` : '';
	}

	render() {
		return (
			<div className="CityMap" style={{
				// position: 'relative',
				// height: 0,
				// paddingBottom: '10%'
				width: '100%',
				maxWidth: this.props.width
			}}>
				<div>
					<ComposableMap {...options}
						width={this.props.width}
						height={this.props.width }
						style={{
							width: '100%',
							// height: '100%',
							// overflow: 'hidden',
							height: 'auto'
						}}
					>
						<ZoomableGroup center={center} >
							<Geographies geography={this.props.url} disableOptimization>
								{(geographies, projection) => geographies.map((geography, i) => {
									let name = geography.properties.Neighborhood;

									return (
										<Geography key={name}
											className="map-shape"
											geography={geography}
											projection={projection}
											style={{
												default: {
													fill: this.updateColor(name),
													fillOpacity: 0.8,
													...baseStyle
												},
												hover: {
													fill: this.updateColor(name),
													...baseStyle
												},
												pressed: {
													fill: this.updateColor(name),
													...baseStyle
												}
											}}
											onClick={this.props.handleClick}
											data-tip={this.updateTooltip(name)}
											data-for="mapTooltip"
										/>
									);
								})}
							</Geographies>
						</ZoomableGroup>
					</ComposableMap>
				</div>

				<ReactTooltip id="mapTooltip" className="custom-tooltip" />
			</div>
		);
	}
}

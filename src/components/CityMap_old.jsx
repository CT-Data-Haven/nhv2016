import React from 'react';
import { ComposableMap, ZoomableGroup, Geographies, Geography } from 'react-simple-maps';
// import ReactTooltip from 'react-tooltip';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import '../styles/CityMap.css';

// import Tooltip from './Tooltip';

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
	constructor() {
		super();
		this.state = {
			tipString: ''
		};
		this.showTooltip = this.showTooltip.bind(this);
		this.hideTooltip = this.hideTooltip.bind(this);
	}

	componentDidMount() {
		// setTimeout(() => ReactTooltip.rebuild(), 100);
	}

	updateColor(name) {
		return this.props.data[name] ? this.props.color(this.props.data[name].value) : '#ccc';
	}

	showTooltip = (geography) => {
		let name = geography.properties.Neighborhood;
		let string = this.props.data[name] ? `${name}: ${this.props.data[name].displayVal}` : 'Long Wharf: NA';
		this.setState({
			tipString: string
		});
	};

	hideTooltip = () => {
		// setTimeout(() => this.setState({ tipString: '' }), 100);

	};

	render() {
		let tooltip = (<Tooltip id="tooltip">{this.state.tipString}</Tooltip>);

		return (
			<div className="CityMap" style={{
				width: '100%',
				maxWidth: 600,
				margin: '0 auto'
			}}>
				<ComposableMap {...options}
					width={600}
					height={600}
					style={{
						width: '100%',
						height: 'auto'
					}}
				>
					{/* <ZoomableGroup center={center} disablePanning> */}
					<Geographies geography={this.props.url} disableOptimization>
						{(geographies, projection) => geographies.map((geography, i) => {
								let name = geography.properties.Neighborhood;

							return (
								<OverlayTrigger key={i} overlay={tooltip} placement="top">
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
										onMouseEnter={this.showTooltip}
										onMouseLeave={this.hideTooltip}
									/>
								</OverlayTrigger>

							);
						})}
					</Geographies>
					{/* </ZoomableGroup> */}
				</ComposableMap>
				{/* <Tooltip string={this.state.tipString} /> */}
				{/* <ReactTooltip id="mapTooltip" className="custom-tooltip" /> */}
				{/* <ReactTooltip place="right" type="success" effect="solid"/> */}
			</div>
		);
	}
}

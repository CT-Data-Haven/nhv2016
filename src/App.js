import React from 'react';
import { Grid, Row, Col, Tabs, Tab, Panel } from 'react-bootstrap';
import * as _ from 'underscore';
import { ckmeans } from 'simple-statistics';
// import { scaleThreshold } from 'd3-scale';
import { scaleThreshold } from '@vx/scale';
import { schemeGnBu } from 'd3-scale-chromatic';

import './App.css';

import TopicForm from './components/TopicForm';
import Profile from './components/Profile';
import CityMap from './components/CityMap';
import Chart from './components/Chart';
import Table from './components/Table';
import Intro from './components/Intro';
import Footer from './components/Footer';

const mapUrl = '../data/nhv_shape_topo.json';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// data: [],
			topic: '',
			indicator: '',
			// indicators available for this topic
			indicators: [],
			// data for all indicators in this topic
			table: [],
			// data for selected indicator
			toMap: [],
			toChart: [],
			hood: 'Amity',
			color: scaleThreshold({ domain: [0, 1], range: ['#ccc'] }),
			viz: 'map'
		};
		// this.onResize = this.onResize.bind(this);
	}

	componentDidMount() {
		let base = this.props.indics[0];
		// make defaults
		this.updateMenus(base.topic, base.indicators[0]);
	}

	handleTopic = (e) => {
		// set indicator to first value under this topic
		let topic = e.target.value;
		let indicator = _.where(this.props.indics, { topic: topic })[0].indicators[0];
		this.updateMenus(e.target.value, indicator);
	};

	handleIndicator = (e) => {
		// send topic, indicator
		this.updateMenus(this.state.topic, e.target.value);
	};

	handleSelect = (e) => {

	};

	handleShapeClick = (e) => {
		if (e.properties.Neighborhood === 'Long Wharf') {
			return;
		}
		this.setState({
			hood: e.properties.Neighborhood
		});
	};

	handleBarClick = (e) => {
		if (e.neighborhood === 'Long Wharf') {
			return;
		}
		this.setState({
			hood: e.neighborhood
		});
	};

	handleButton = (val) => {
		this.setState({
			viz: val
		});
	};

	updateMenus(topic, indicator) {
		// pull table, toMap; set state
		let indicators = _.where(this.props.indics, { topic: topic })[0].indicators;
		let table = _.where(this.props.data, { key: topic })[0].values;
		// 2016 data will have type of geography--use to filter for only neighborhoods
		let toMap = _.chain(table)
			.where({ indicator: indicator, geoType: '1_neighborhood' })
			.indexBy('neighborhood')
			// .without('New Haven', 'Connecticut')
			.value();
		let toChart = _.chain(table)
			.where({ indicator: indicator })
			// .indexBy('indicator')
			.sortBy((d) => 1 - d.value)
			.value();

		this.setState({
			topic,
			indicators,
			indicator,
			table,
			toMap,
			toChart,
			color: this.makeScale(toMap)
		});
	}



	makeScale(data) {
		let vals = _.pluck(data, 'value');
		if (!vals.length) {
			return scaleThreshold({ domain: [0, 1], range: ['#ccc'] });
		} else {
			let brks = ckmeans(vals, 5).map((d) => d[0]).slice(1);
			// return scaleThreshold()
			// 	.domain(brks)
			// 	.range(schemeGnBu[5]);
			return scaleThreshold({
				domain: brks,
				range: schemeGnBu[5]
			});
		}
	}

	render() {
		let header = <h3>{this.state.indicator} by neighborhood, 2016</h3>;
		return (
			<div className="App">
				<Grid>
					<Row>
						<Col md={12}><Intro /></Col>
					</Row>
					<Row>
						<Col md={12}>
							<TopicForm
								indics={this.props.indics}
								handleTopic={this.handleTopic}
								handleIndicator={this.handleIndicator}
								topic={this.state.topic}
								indicators={this.state.indicators}
								handleSelect={this.handleSelect}
							/>
						</Col>
					</Row>
					<Row>
						<Col md={12}>
							<Panel header={header}>
								<Col md={8}>
									<div id="viz-holder">
										<Tabs activeKey={this.state.viz} id="tabs" onSelect={this.handleButton}>
											<Tab eventKey="map" title="View map">
												<CityMap
													url={mapUrl}
													// width={this.state.width}
													width={600}
													handleClick={this.handleShapeClick}
													data={this.state.toMap}
													color={this.state.color}
												/>
											</Tab>
											<Tab eventKey="chart" title="View chart">
												<Chart
													// size={[this.state.width, this.state.width]}
													size={[600, 400]}
													handleClick={this.handleBarClick}
													data={this.state.toChart}
													hood={this.state.hood}
												/>
											</Tab>
										</Tabs>
									</div>
								</Col>
								<Col md={4}>
									<Profile
										table={this.state.table}
										hood={this.state.hood}
										indics={this.props.indics}
										topic={this.state.topic}
									/>

								</Col>
							</Panel>
						</Col>
					</Row>

					<Row>
						<Col md={12}><Table data={this.state.table} hood={this.state.hood} /></Col>
					</Row>
					<Row>
						<Col md={12}><Footer /></Col>
					</Row>
				</Grid>

			</div>
		);
	}
}

export default App;

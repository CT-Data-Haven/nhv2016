import React from 'react';
import { nest } from 'd3-collection';
import { format } from 'd3-format';
import * as _ from 'underscore';

import SortAsc from 'react-icons/lib/fa/sort-asc';
import SortDesc from 'react-icons/lib/fa/sort-desc';
import Sort from 'react-icons/lib/fa/sort';

import ReactTable from 'react-table';
import 'react-table/react-table.css';
import '../styles/CityTable.css';


const percent = format('.0%');
const comma = format(',');

const formatNumber = (s) => (s > 0 && s < 1) ? percent(s) : comma(s);

export default class Table extends React.Component {
	constructor() {
		super();
		this.state = {
			sorted: []
		};
		this.getSorted = this.getSorted.bind(this);
	}

	getSorted = (id) => {
		let sortInfo = this.state.sorted.filter((item) => item.id === id);
		if (sortInfo.length) {
			if (sortInfo[0].desc === true) return <SortDesc />;
			if (sortInfo[0].desc === false) return <SortAsc />;
		}
		return <Sort />;
	};

	hiliteHood = (state, rowInfo, column) => {
		let hood = rowInfo ? rowInfo.row.Neighborhood : null;
		if (hood === this.props.hood) {
			return { style: { background: '#e0f3db' } };
		} else {
			return {};
		}
	};

	render() {
		let nested = nest()
			.key((d) => d.neighborhood)
			.rollup((d) => {
				return d.reduce((prev, curr) => {
					prev.Neighborhood = curr.neighborhood;
					prev[curr.indicator] = curr.value;
					return prev;
				}, {});
			})
			.entries(this.props.data);


		let table = _.pluck(nested, 'value');
		let columns = _.chain(table[0])
			.keys()
			.without('Neighborhood')
			.map((d, i) => (
				{
					Header: props => (
						<span>{d} {this.getSorted(props.column.id)}</span>
					),
					// Header: d,
					headerStyle: { boxShadow: 'none' },
					accessor: d,
					Cell: row => (
						<span>{formatNumber(row.value)}</span>
					),
					resizable: false,
					className: 'right-cell'
				}
			))
			.value();
		columns.unshift({
			Header: props => (
				<span>Neighborhood {this.getSorted(props.column.id)}</span>
			),
			headerStyle: { boxShadow: 'none' },
			accessor: 'Neighborhood',
			resizable: false
		});

		let rows = table.length || 22;

		return (
			<div className="CityTable">
				<ReactTable
					data={table}
					columns={columns}
					className="-highlight table-responsive"
					defaultPageSize={rows}
					// pageSizeOptions={[5, 10, rows]}
					showPageSizeOptions={false}
					showPagination={false}
					style={{
						height: '400px'
					}}
					getTrProps={this.hiliteHood}
					// sorted={sorted}
					onSortedChange={(sorted) => this.setState({sorted})}
				/>
			</div>
		);
	}
}

import React from 'react';
import { nest } from 'd3-collection';
import { format } from 'd3-format';
import * as _ from 'underscore';

import ReactTable from 'react-table';
import 'react-table/react-table.css';
import '../styles/CityTable.css';


const percent = format('.0%');
const comma = format(',');

const formatNumber = (s) => (s > 0 && s < 1) ? percent(s) : comma(s);

export default class Table extends React.Component {

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
					Header: d,
					accessor: d,
					Cell: row => (
						<span>{formatNumber(row.value)}</span>
					),
					resizable: false,
					className: 'right-cell'
				}
			))
			.value();
		columns.unshift({ Header: 'Neighborhood', accessor: 'Neighborhood', resizable: true });

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
				/>
			</div>
		);
	}
}

import React from 'react';
import { Thumbnail } from 'react-bootstrap';

import src from '../img/25th-logotype.jpg';

const text = 'Source: DataHaven analysis (2017) of US Census Bureau American Community Survey 2016 5-year estimates.';

const Footer = () => (
	<div className="Footer">
		<p>{text}</p>
		<p><a href="https://github.com/ct-data-haven/nhv2016/blob/master/public/data/2016_nhv_display.csv">Download all New Haven 2016 profile data</a></p>
		<Thumbnail src={src} href="http://www.ctdatahaven.org" style={{ width: '12em' }} />
	</div>
);

export default Footer;

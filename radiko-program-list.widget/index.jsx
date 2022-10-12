import { styled }       from 'uebersicht';
import * as Libraries   from './lib/libraries.bundle';

export const className = `
	top:      0em;
	left:     0em;
	z-index:  99999999;

	> div {
		width:          30em;
		max-height:     58vh;
		overflow-y:     scroll;
		overflow-x:     hidden;

		display:        flex;
		flex-direction: column;
	}

	@keyframes marquee {
		from   { left: 100%; transform: translate(0%); }
		99%,to { left: 0%;   transform: translate(-100%); }
	},
`;

const Station     = styled('section')(props => ({
	padding:      '0.3em',
	margin:       '0.3em',
	borderRadius: '0.2em',
	color:        'rgba(230,230,230,.8)',
	background:   'rgba(51,49,50,.9)',
}));

const StationInfo = styled('div')(props => ({
	display:      'flex',
	alignItems:   'baseline',
	marginBottom: '0.1em',

	'& .description': {
		paddingLeft: '0.5em',
	},

	'& .name': {
		paddingLeft: '1em',
	}
}));

const Icon        = styled('img')(props => ({
	height:      '1.3em',
	width:       '1.3em',
}));

const Program     = styled('div')(props => ({
	display:     'flex',
	paddingTop:  '0.1em',
	paddingLeft: '0.5em'
}));

const Logo        = styled('div')(props => ({
	img: {
		height: '4.5em',
		outline: '1px solid rgba(93,93,99,.9)',
	}
}));

const Information = styled('div')(props => ({
	width:       '20em',
	paddingLeft: '1em',
}));

const Row         = styled('div')(props => ({
	display: 'flex',
}));

const DESCRIPTION = styled('div')(props => ({
	fontSize:   '0.1em',
	whiteSpace: 'nowrap',
}))

const LED         = styled('div')(props => ({
	outline: '1px solid rgba(93,93,99,.9)',

	'& div': {
		position:   'relative',
		width:      '100%',
		overflow:   'hidden',
		color:      (props.color ? props.color : 'rgba(251,177,97,.8)'),
		fontSize:   '0.8em',
		fontWeight: 'bold',
		textShadow: '0 0 8em',
	
		'&:after':  {
			content:         `''`,
			position:        'absolute',
			top:             '0',
			left:            '0',
			width:           '100%',
			height:          '100%',
			backgroundImage: 'radial-gradient(transparent 0 1px, rgba(0,0,0,.7) 1px)',
			backgroundSize:  '2px 2px',
		},

		'& span': {
			display:                 'inline-block',
			paddingLeft:             '100%',
			whiteSpace:              'nowrap',
			animationName:           'marquee',
			animationTimingFunction: 'linear',
			animationIterationCount: 'infinite',
			animationDuration:       (props.duration ? props.duration : '15s'),
		}
	}
}));

const LEDLIGHT      = styled('div')(props => ({
	outline: '1px solid rgba(93,93,99,.9)',

	'& div': {
		position:   'relative',
		width:      '100%',
		overflow:   'hidden',
		color:      (props.color ? props.color : 'rgba(251,177,97,.8)'),
		fontSize:   '0.8em',
		fontWeight: 'bold',
		textShadow: '0 0 8em',
		textAlign:  'center',
	
		'&:after':  {
			content:         `''`,
			position:        'absolute',
			top:             '0',
			left:            '0',
			width:           '100%',
			height:          '100%',
			backgroundImage: 'radial-gradient(transparent 0 1px, rgba(0,0,0,.7) 1px)',
			backgroundSize:  '2px 2px',
		},

		'& span': {
			display:    'inline-block',
			whiteSpace: 'nowrap',
		}
	}
}));

export const command = `curl -sS -L https://radiko.jp/v3/program/now/JP13.xml`;

export let refreshFrequency = (() => {
	const now     = new Date();
	const seconds = 60 - now.getSeconds();
	const minute  = (() => {
		const max = 30 < now.getMinutes() ? 60 : 30;

		return max - now.getMinutes() - (0 === seconds ? 0 : 1);
	})();

	return (minute * 60 * 1000) + (seconds * 1000);
})();

const STATUS = {
	XML_RECEIVED: 'RPL/XML_RECEIVED'
};

export const updateState = (event, previousState) => {
	refreshFrequency = 30 * 60 * 1000;

	if (event.error) {
		return { ...previousState, warning: `We got an error: ${event.error}` };
	}

	return {
		type: STATUS.XML_RECEIVED,
		data: assembly(Libraries.radiko.analysis(event.output)),
	}
}

function assembly(data) {
	const stations = [];

	Object.keys(data).forEach(
		(station) => {
			const programs = [];

			programs.push(
				<Program key = {data[station][0].title}>
					<Logo><img src = {data[station][0].img} /></Logo>
					<Information>
						<DESCRIPTION>番組情報</DESCRIPTION>
						<LED>
							<div>
								<span>{data[station][0].title} {data[station][0].pfm}</span>
							</div>
						</LED>
						<Row style = {{ marginTop: '0.2em' }}>
							<div>
								<DESCRIPTION>開始時間</DESCRIPTION>
								<LEDLIGHT>
									<div style = {{ heigth: '1.6em' }}>
										<span style = {{ lineHeight: '1.6em' }}>
											{data[station][0].time.slice(0,2)}:{data[station][0].time.slice(2,4)}
										</span>
									</div>
								</LEDLIGHT>
							</div>
							<div style = {{ paddingLeft: '0.5em', width: '17.3em' }}>
								<DESCRIPTION>概要</DESCRIPTION>
								<LED duration = { '180s' }>
									<div style = {{ height: '1.6em' }}>
										<span style = {{ lineHeight: '1.6em' }}>
											{Libraries.striptags(data[station][0].info)}
										</span>
									</div>
								</LED>
							</div>
						</Row>
					</Information>
				</Program>
			);

			stations.push(
				<Station key = {station}>
					<StationInfo>
						<Icon src = { '/radiko-program-list.widget/radio.svg' } />
						<span className = 'description'>ラジオ局</span>
						<span className = 'name'>{station}</span>
					</StationInfo>
					{programs}
				</Station>
			);
		}
	);

	return stations;
}

export const render = ({ type, data }) => {
	return (
		<div>{data}</div>
    );
}

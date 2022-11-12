import { run, styled } from 'uebersicht';
import * as Libraries  from './lib/libraries.bundle';
import * as Components from './lib/components';

export const className        = `
	top:      0em;
	left:     0em;

	@keyframes marquee {
		from   { left: 100%; transform: translate(0%); }
		99%,to { left: 0%;   transform: translate(-100%); }
	}
`;

const Stations                = styled('div')(props => ({
	maxHeight:     '58.5vh',

	flexDirection: 'column',
	width:         '30em',
	overflowY:     'scroll',
	overflowX:     'hidden',
}));

const refreshInterval         = 30;

const DESCRIPTION             = {
	radio:       'ラジオ局',
	program:     '放送情報',
	start:       '開始時間',
	description: '概要',
}

const STATUS                  = {
	STARTUP:      'RPL/STARTUP',
	RELOAD:       'RPL/RELOAD',
	MINIMIZE:     'RPL/MINIMIZE',
	MAXIMIZE:     'RPL/MAXIMIZE',
};

export const command          = `curl -sS -L https://radiko.jp/v3/program/now/JP13.xml`;

export const refreshFrequency = false;

export const initialState     = { type: STATUS.STARTUP };

export const init             = (dispatch) => {
	setTimeout(
		() => {
			run(command).then(output => dispatch({ output: output })).catch(error => dispatch({ error: error }));
			setInterval(
				() => {
					run(command).then(output => dispatch({ output: output })).catch(error => dispatch({ error: error }));
				},
				refreshInterval * (60 * 1000)
			);
		},
		nextRefreshTime()
	);
}

export const updateState      = (event, previousState) => {
	if (event.error) {
		return { ...previousState, warning: `We got an error: ${event.error}` };
	}

	if (STATUS.MINIMIZE === event.type || STATUS.MAXIMIZE === event.type) {
		return { ...previousState, ...event };
	}

	return { ...previousState, data: assembly(Libraries.radiko.analysis(event.output)) };
}

export const render           = (props, dispatch) => {
	return (
		<div
			style = {{
				width: '30em',
			}}
		>
			<Components.Molecuels.Buttons
				onClickMinimize = { STATUS.MINIMIZE !== props.type ? (() => dispatch({ type: STATUS.MINIMIZE })) : undefined }
				onClickMaximize = { STATUS.MINIMIZE === props.type ? (() => dispatch({ type: STATUS.MAXIMIZE })) : undefined }
				onClickReload   = {() => {
					run(
						command
					).then(
						(output) => {
							dispatch({ type: STATUS.RELOAD, output: output });
						}
					).catch(
						(error) => {
							dispatch({ typy: STATUS.RELOAD, error: error })
						}
					)
				}}
			/>
			<Stations
				style = {{
					display: STATUS.MINIMIZE === props.type ? 'none' : 'flex'
				}}
			>
				{ props.data }
			</Stations>
		</div>
    );
}

function nextRefreshTime() {
	const now           = new Date();
	const remainSeconds = 60 - now.getSeconds();
	const remainMinutes = now.getMinutes() % refreshInterval;

	const seconds       = remainSeconds;
	const minutes       = 0 === remainMinutes ? refreshInterval : refreshInterval - remainMinutes;

	if (60 === seconds) {
		return minutes * 60 * 1000;
	} else {
		return ((minutes -1) * 60 * 1000) + (seconds * 1000);
	}
}

function assembly(data) {
	const stations = [];

	Object.keys(data).forEach(
		(station) => {
			const programs = [];

			programs.push(
				<Components.Molecuels.Program
					key         = {data[station][0].title}
					logo        = {{ src: data[station][0].img }}
					program     = {{ description: DESCRIPTION.program,     text: `${data[station][0].title} ${data[station][0].pfm}` }}
					start       = {{ description: DESCRIPTION.start,       text: `${data[station][0].time.slice(0,2)}:${data[station][0].time.slice(2,4)}` }}
					description = {{ description: DESCRIPTION.description, text: `${Libraries.striptags(data[station][0].info)}` }}
				/>
			);

			stations.push(
				<Components.Molecuels.Station
					key         = { station }
					description = { DESCRIPTION.radio }
					name        = { station }
				
				>
					{ programs }
				</Components.Molecuels.Station>
			);
		}
	);

	return stations;
}

import { css }    from 'uebersicht';
import * as Atoms from '../../../atoms';

const Info = ({ className, style, description, name }) => {
	return (
		<div
			className = { `${ className ? className : '' } ${baseStyle(style)}`.trim() }
		>
			<Atoms.Icon.Radio
				style = {{
					height: '1.4em',
					width:  '1.4em',
					fill:   'rgba(230,230,230,.8)',
				}}
			/>
			<span className = 'description'>{ description }</span>
			<span className = 'name'>{ name }</span>
		</div>
	);
}

const baseStyle = (style) => css`
	display:       flex;
	align-items:   baseline;
	margin-bottom: 0.1em;

	& .description {
		padding-left: 0.3em;
	}

	& .name {
		padding-left: 1em;
	}
	${style}
`;

export {
	Info,
};

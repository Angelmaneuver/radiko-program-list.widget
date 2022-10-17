import { css }  from 'uebersicht';
import { Info } from './info/index.jsx';

const Station = ({
	className,
	style,
	description,
	name,
	children,
}) => {
	return (
		<section
			className = { `${ className ? className : '' } ${baseStyle(style)}`.trim() }
		>
			<Info
				description = { description }
				name        = { name }
			/>
			{ children }
		</section>
	);
}

const baseStyle = (style) => css`
	padding:       0.3em;
	margin:        0.3em;
	border-radius: 0.2em;
	color:         rgba(230,230,230,.8);
	background:    rgba(51,49,50,.9);
	${style}
`;

export {
	Station,
}

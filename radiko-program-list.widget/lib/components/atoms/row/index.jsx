import { css } from 'uebersicht';

const Row        = ({ className, style, children }) => {
	return (
		<div
			className = { `${ className ? className : '' } ${baseStyle(style)}`.trim() }
		>
			{ children }
		</div>
	);
}

const baseStyle = (style) => css`
	display: flex;
	${style}
`;

export {
	Row,
};

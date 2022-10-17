import { css } from 'uebersicht';

const Logo = ({ className, style, src }) => {
	return (
		<div
			className = { `${ className ? className : '' } ${baseStyle(style)}`.trim() }
		>
			<img src = { src }/>
		</div>
	);
}

const baseStyle = (style) => css`
	& img {
		height:  4.5em;
		outline: 1px solid rgba(93,93,99,.9);
	}
	${style}
`;

export {
	Logo,
};

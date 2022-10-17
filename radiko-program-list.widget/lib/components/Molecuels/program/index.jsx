import { css }    from 'uebersicht';
import * as Atoms from '../../atoms';

const Program = ({
	className,
	style,
	logo,
	program,
	start,
	description,
}) => {
	return (
		<Atoms.Row
			className = { `${ className ? className : '' } ${baseStyle(style)}`.trim() }
		>
			<Atoms.Logo src = { (logo && 'src' in logo) ? logo.src : '' }/>
			<div
				style = {{
					width:       '20em',
					paddingLeft: '1em',				
				}}
			>
				<Atoms.Description text = { (program && 'description' in program) ? program.description : '' }/>
				<Atoms.LED         text = { (program && 'text'        in program) ? program.text        : '' }/>
				<Atoms.Row
					style = {{
						marginTop: '0.2em'
					}}
				>
					<div>
						<Atoms.Description text = { (start && 'description' in start) ? start.description : '' }/>
						<Atoms.LED
							style     = {{
								lineHeight: '1.565em',
								height:     '1.565em',
								textAlign:  'center',
							}}
							text      = { (start && 'text' in start) ? start.text : '' }
							noMarquee = { true }
						/>
					</div>
					<div
						style = {{
							width:       '100%',
							paddingLeft: '0.5em',
						}}
					>
						<Atoms.Description text = { (description && 'description' in description) ? description.description : '' }/>
						<Atoms.LED
							style = {{
								lineHeight: '1.565em',
								height:     '1.565em',
								width:      '21.55em !important',
							}}
							text  = { (description && 'text' in description) ? description.text : '' }
						/>
					</div>
				</Atoms.Row>
			</div>
		</Atoms.Row>
	);
}

const baseStyle = (style) => css`
	padding-top:  0.1em;
	padding-left: 0.5em;
	${style}
`;

export {
	Program,
}

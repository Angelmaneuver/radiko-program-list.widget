import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
	ignoreAttributes:     false,
	attributeNamePrefix : '',
});

function analysis(xml: string) {
	const result   = {} as Record<string, unknown>;
	const stations = (parser.parse(xml)).radiko.stations.station as Array<Record<string, unknown>>;

	stations.forEach(
		(station) => {
			const name       = station.name as string;
			const programs   = ((station.progs as Record<string, unknown>).prog as Array<Record<string, unknown>>);
			const programSet = [] as Array<unknown>;

			programs.forEach(
				(program) => {
					programSet.push({
						title: program.title,
						time:  program.ftl,
						img:   program.img,
						info:  program.info,
						pfm:   program.pfm,
					});
				}
			);

			result[name] = programSet;
		}
	);

	return result;
}

export {
	analysis,
};

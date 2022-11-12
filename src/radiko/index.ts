import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
	ignoreAttributes:     false,
	attributeNamePrefix : '',
});

function analysis(xml: string) {
	const result   = {} as Record<string, unknown>;
	const stations = (parser.parse(xml)).radiko.stations.station as Array<Record<string, unknown>>;
	const now      = (() => {
		const datetime = new Date();

		return `${datetime.getHours().toString().padStart(2, '0')}${datetime.getMinutes().toString().padStart(2, '0')}`;
	})();

	stations.forEach(
		(station) => {
			const name       = station.name as string;
			const programs   = (station.progs as Record<string, unknown>).prog;
			const programSet = [] as Array<unknown>;
			const program    = (() => {
				if (Array.isArray(programs)) {
					for (const program of programs) {
						if (program.ftl <= now && now < program.tol) {
							return program;
						}
					}
				} else {
					return programs;
				}
			})();

			if (program) {
				programSet.push({
					title: program.title,
					time:  program.ftl,
					img:   program.img,
					info:  program.info,
					pfm:   program.pfm,
				});
	
				result[name] = programSet;
			}
		}
	);

	return result;
}

export {
	analysis,
};

import type { Champion, ChampionStat, Game, PlayerStat, Stat, User } from '@prisma/client';

export function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export const championsToFormat: Record<string, string> = {
	ksante: 'KSante',
	leesin: 'LeeSin',
	missfortune: 'MissFortune',
	kogmaw: 'KogMaw',
	drmundo: 'DrMundo',
	aurelionsol: 'AurelionSol',
	xinzhao: 'XinZhao',
	jarvaniv: 'JarvanIV',
	twistedfate: 'TwistedFate',
	tahmkench: 'TahmKench',
	monkeyking: 'MonkeyKing',
	reksai: 'RekSai',
	masteryi: 'MasterYi'
};

export const championMapDisplayToDb: Record<string, string> = {
	Aatrox: 'aatrox',
	Ahri: 'ahri',
	Akali: 'akali',
	Akshan: 'akshan',
	Alistar: 'alistar',
	Amumu: 'amumu',
	Anivia: 'anivia',
	Annie: 'annie',
	Aphelios: 'aphelios',
	Ashe: 'ashe',
	'Aurelion Sol': 'aurelionsol',
	Azir: 'azir',
	Bard: 'bard',
	"Bel'Veth": 'belveth',
	Blitzcrank: 'blitzcrank',
	Brand: 'brand',
	Braum: 'braum',
	Caitlyn: 'caitlyn',
	Camille: 'camille',
	Cassiopeia: 'cassiopeia',
	"Cho'Gath": 'chogath',
	Corki: 'corki',
	Darius: 'darius',
	Diana: 'diana',
	'Dr. Mundo': 'drmundo',
	Draven: 'draven',
	Ekko: 'ekko',
	Elise: 'elise',
	Evelynn: 'evelynn',
	Ezreal: 'ezreal',
	Fiddlesticks: 'fiddlesticks',
	Fiora: 'fiora',
	Fizz: 'fizz',
	Galio: 'galio',
	Gangplank: 'gangplank',
	Garen: 'garen',
	Gnar: 'gnar',
	Gragas: 'gragas',
	Graves: 'graves',
	Gwen: 'gwen',
	Hecarim: 'hecarim',
	Heimerdinger: 'heimerdinger',
	Illaoi: 'illaoi',
	Irelia: 'irelia',
	Ivern: 'ivern',
	Janna: 'janna',
	'Jarvan IV': 'jarvaniv',
	Jax: 'jax',
	Jayce: 'jayce',
	Jhin: 'jhin',
	Jinx: 'jinx',
	"K'Sante": 'ksante',
	"Kai'Sa": 'kaisa',
	Kalista: 'kalista',
	Karma: 'karma',
	Karthus: 'karthus',
	Kassadin: 'kassadin',
	Katarina: 'katarina',
	Kayle: 'kayle',
	Kayn: 'kayn',
	Kennen: 'kennen',
	"Kha'Zix": 'khazix',
	Kindred: 'kindred',
	Kled: 'kled',
	"Kog'Maw": 'kogmaw',
	LeBlanc: 'leblanc',
	'Lee Sin': 'leesin',
	Leona: 'leona',
	Lillia: 'lillia',
	Lissandra: 'lissandra',
	Lucian: 'lucian',
	Lulu: 'lulu',
	Lux: 'lux',
	Malphite: 'malphite',
	Malzahar: 'malzahar',
	Maokai: 'maokai',
	'Master Yi': 'masteryi',
	'Miss Fortune': 'missfortune',
	Mordekaiser: 'mordekaiser',
	Morgana: 'morgana',
	Nami: 'nami',
	Nasus: 'nasus',
	Nautilus: 'nautilus',
	Neeko: 'neeko',
	Nidalee: 'nidalee',
	Nilah: 'nilah',
	Nocturne: 'nocturne',
	Nunu: 'nunu',
	Olaf: 'olaf',
	Orianna: 'orianna',
	Ornn: 'ornn',
	Pantheon: 'pantheon',
	Poppy: 'poppy',
	Pyke: 'pyke',
	Qiyana: 'qiyana',
	Quinn: 'quinn',
	Rakan: 'rakan',
	Rammus: 'rammus',
	"Rek'Sai": 'reksai',
	Rell: 'rell',
	'Renata Glasc': 'renata',
	Renekton: 'renekton',
	Rengar: 'rengar',
	Riven: 'riven',
	Rumble: 'rumble',
	Ryze: 'ryze',
	Samira: 'samira',
	Sejuani: 'sejuani',
	Senna: 'senna',
	Seraphine: 'seraphine',
	Sett: 'sett',
	Shaco: 'shaco',
	Shen: 'shen',
	Shyvana: 'shyvana',
	Singed: 'singed',
	Sion: 'sion',
	Sivir: 'sivir',
	Skarner: 'skarner',
	Sona: 'sona',
	Soraka: 'soraka',
	Swain: 'swain',
	Sylas: 'sylas',
	Syndra: 'syndra',
	'Tahm Kench': 'tahmkench',
	Taliyah: 'taliyah',
	Talon: 'talon',
	Taric: 'taric',
	Teemo: 'teemo',
	Thresh: 'thresh',
	Tristana: 'tristana',
	Trundle: 'trundle',
	Tryndamere: 'tryndamere',
	'Twisted Fate': 'twistedfate',
	Twitch: 'twitch',
	Udyr: 'udyr',
	Urgot: 'urgot',
	Varus: 'varus',
	Vayne: 'vayne',
	Veigar: 'veigar',
	"Vel'Koz": 'velkoz',
	Vex: 'vex',
	Vi: 'vi',
	Viego: 'viego',
	Viktor: 'viktor',
	Vladimir: 'vladimir',
	Volibear: 'volibear',
	Warwick: 'warwick',
	Wukong: 'monkeyking',
	Xayah: 'xayah',
	Xerath: 'xerath',
	'Xin Zhao': 'xinzhao',
	Yasuo: 'yasuo',
	Yone: 'yone',
	Yorick: 'yorick',
	Yuumi: 'yuumi',
	Zac: 'zac',
	Zed: 'zed',
	Zeri: 'zeri',
	Ziggs: 'ziggs',
	Zilean: 'zilean',
	Zoe: 'zoe',
	Zyra: 'zyra'
};

export const championMapDbToDisplay: Record<string, string> = Object.fromEntries(
	Object.entries(championMapDisplayToDb).map((a) => a.reverse())
);

export const getChampionName = (championName: string) => {
	if (championName in championsToFormat) {
		return capitalize(championsToFormat[championName]);
	}
	return capitalize(championName);
};

export const getColor = (position: number) => {
	if (position === 0) {
		return 'text-yellow-500 dark:text-amber-300';
	} else if (position === 1) {
		return 'text-gray-500';
	} else if (position === 2) {
		return 'text-amber-700';
	}
	return '';
};

export const computeStat = (stat: Stat) => {
	return stat.kda + stat.damage + stat.perf + stat.xClass;
};

export type GameCreateStat = PlayerStat & {
	user: User | null;
	stat: Stat | null;
	champion: Champion & {
		stats: ChampionStat[];
	};
	game: Game & {
		players: (PlayerStat & {
			user: User | null;
			champion: Champion & {
				stats: ChampionStat[];
			};
		})[];
	};
};

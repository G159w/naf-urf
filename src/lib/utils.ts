export function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export const championsToFormat = {
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

export const getChampionName = (championName: string) => {
	if (championName in championsToFormat) {
		return capitalize(championsToFormat[championName]);
	}
	return capitalize(championName);
};

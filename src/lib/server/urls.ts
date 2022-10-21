export const RIOT_BASE_URL = 'https://euw1.api.riotgames.com/lol/';
export const RIOT_SUMMONER_URL = (name: string) => `${RIOT_BASE_URL}summoner/v4/summoners/by-name/${name}?api_key=${process.env.RIOT_API_KEY}`
export const MATCH_IDS_URL = (puuid: string) => `${RIOT_BASE_URL}match/v5/matches/by-puuid/${puuid}?api_key=${process.env.RIOT_API_KEY}`
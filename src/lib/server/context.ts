import { PrismaClient } from '@prisma/client';
import { RiotAPI } from '@fightmegg/riot-api';
import { RIOT_API_KEY, DATABASE_URL } from '$env/static/private';

const prisma = new PrismaClient({
	datasources: {
		db: {
			url: DATABASE_URL
		}
	}
});
const riotApi = new RiotAPI(RIOT_API_KEY);

export type GraphQLContext = {
	prisma: PrismaClient;
	riotApi: RiotAPI;
};

export async function createContext(): Promise<GraphQLContext> {
	return { prisma, riotApi };
}

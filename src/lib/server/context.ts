import { PrismaClient } from '@prisma/client';
import { RiotAPI, RiotAPITypes, PlatformId } from '@fightmegg/riot-api';
import { logger } from './logger';

const prisma = new PrismaClient();
const riotApi = new RiotAPI(process.env.RIOT_API_KEY);

export type GraphQLContext = {
	prisma: PrismaClient;
	riotApi: RiotAPI;
};

logger.info('context');

export async function createContext(): Promise<GraphQLContext> {
	return { prisma, riotApi };
}

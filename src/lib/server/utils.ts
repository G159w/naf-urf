import type { PrismaClient } from '@prisma/client';
import { subMinutes } from 'date-fns';

export const numberOfPossibleRequests = async (prisma: PrismaClient) => {
	const requests = await prisma.lolRequest.aggregate({
		where: {
			createdAt: {
				gte: subMinutes(new Date(), 2)
			}
		},
		_sum: {
			count: true
		}
	});
	return 95 - requests._sum.count;
};

export function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

UPDATE "PlayerStat" SET "totalCs" = "totalMinionsKilled" + "neutralMinionsKilled" WHERE "totalCs"  IS NULL;


ALTER TABLE "PlayerStat" ALTER COLUMN "totalCs" SET NOT NULL;

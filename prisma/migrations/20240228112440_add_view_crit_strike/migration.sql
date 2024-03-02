-- AlterSequence
ALTER SEQUENCE "Game_id_seq" MAXVALUE 9223372036854775807;

-- AlterSequence
ALTER SEQUENCE "PlayerStat_id_seq" MAXVALUE 9223372036854775807;

-- AlterSequence
ALTER SEQUENCE "Stat_id_seq" MAXVALUE 9223372036854775807;

-- AlterTable
ALTER TABLE "PlayerStat" ADD COLUMN     "largestCriticalStrike" INT4;

CREATE VIEW Top5TankedMitigatedPerUser AS
SELECT 
    "userId",
    "gameId",
    tankedMitigated
FROM (
    SELECT 
        ps."userId", 
        ps."gameId", 
        (ps.tanked + ps.mitigated) as tankedMitigated,
        ROW_NUMBER() OVER(PARTITION BY ps."userId" ORDER BY (ps.tanked + ps.mitigated) DESC) as rn
    FROM 
        "PlayerStat" ps
) t
WHERE 
    t.rn <= 5;
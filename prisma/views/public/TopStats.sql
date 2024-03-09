SELECT
  ps.id,
  ps."gameId",
  ps."championId",
  ps."userId",
  ps."sumName",
  ps.puuid,
  ps."isAllyTeam",
  ps.kills,
  ps.deaths,
  ps.assists,
  ps.damage,
  ps.tanked,
  ps.mitigated,
  ps."totalTimeCCDealt",
  ps."isFirstBloodKill",
  ps."doubleKills",
  ps."tripleKills",
  ps."quadraKills",
  ps."pentaKills",
  ps."timeCCingOthers",
  ps."goldEarned",
  ps."totalMinionsKilled",
  ps."neutralMinionsKilled",
  ps."isWin",
  ps."totalTimeSpentDead",
  ps."updatedAt",
  ps."createdAt",
  ps."totalCs",
  ps."largestCriticalStrike",
  ps."largestKillingSpree",
  ps."longestTimeSpentLiving",
  ps."spell1Casts",
  ps."spell2Casts",
  ps."spell3Casts",
  ps."spell4Casts",
  ps."summoner1Casts",
  ps."summoner2Casts",
  ps."totalDamageShieldedOnTeammates",
  ps."totalHeal",
  ps."totalHealsOnTeammates",
  stat.id AS "statId",
  (ps.tanked + ps.mitigated) AS "totalTanked",
  (CAST(ps.damage AS FLOAT8) / (game.duration / 60)) AS "dmgPerMinute",
  (
    CAST(ps.tanked + ps.mitigated AS FLOAT8) / (game.duration / 60)
  ) AS "tankedPerMinute",
  (
    CAST(ps."goldEarned" AS FLOAT8) / (game.duration / 60)
  ) AS "goldPerMinute",
  (ps.damage / ps."goldEarned") AS "dmgPerGold"
FROM
  "TestBerthier".public."PlayerStat" AS ps
  JOIN "TestBerthier".public."Game" AS game ON ps."gameId" = game.id
  LEFT JOIN "TestBerthier".public."Stat" AS stat ON stat."playerStatId" = ps.id
WHERE
  ps."userId" IS NOT NULL
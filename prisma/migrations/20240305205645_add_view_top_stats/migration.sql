DROP VIEW top5tankedmitigatedperuser;

CREATE VIEW "TopStats" AS
SELECT
    ps.*,
    stat."id" as "statId",
    (ps.tanked + ps.mitigated) as "totalTanked",
    (cast(ps.damage as float) / (game.duration / 60)) as "dmgPerMinute",
    (
        cast(ps.tanked + ps.mitigated as float) / (game.duration / 60)
    ) as "tankedPerMinute",
    (
        cast(ps."goldEarned" as float) / (game.duration / 60)
    ) as "goldPerMinute",
    (
        cast(ps.damage as float) / cast(ps."goldEarned" as float)
    ) as "dmgPerGold"
FROM
    "PlayerStat" as ps
    JOIN "Game" as game ON ps."gameId" = game."id"
    LEFT JOIN "Stat" as stat ON stat."playerStatId" = ps."id"
WHERE
    ps."userId" IS NOT NULL

SELECT team_name AS Team, player_name AS player, player_information.player_id as playerID FROM team_information
RIGHT OUTER JOIN team_rosters_spring_2020
ON team_information.team_id = team_rosters_spring_2020.team_id
RIGHT OUTER JOIN player_information
ON team_rosters_spring_2020.player_id = player_information.player_id
INNER JOIN positions
ON player_information.positions_position_id = positions.position_id
WHERE player_information.player_id != -1 and team_name IS NULL
ORDER BY player_information.player_name
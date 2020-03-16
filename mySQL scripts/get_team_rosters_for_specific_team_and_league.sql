

SELECT team_name AS Team, player_name AS Player, position_name AS Position FROM team_information
INNER JOIN team_rosters_spring_2020
ON team_information.team_id = team_rosters_spring_2020.team_id
INNER JOIN player_information
ON team_rosters_spring_2020.player_id = player_information.player_id
INNER JOIN positions
ON player_information.positions_position_id = positions.position_id
WHERE league_id = 1 and team_information.team_id = 10 and player_information.player_id != -1
ORDER BY team_information.team_name
SELECT match_id, lcs_playoffs.game_id, blue_side_team as blue_team_id, blue_side.team_name as blue_side_team, red_side_team as red_side_team_id, red_side.team_name as red_side_team, DATE_FORMAT(game_data, '%M %D %Y') as game_date
FROM lcs_playoffs
INNER JOIN lcs_game_information
ON lcs_game_information.game_id = lcs_playoffs.game_id
INNER JOIN lcs_game_weeks
On lcs_game_weeks.game_id = lcs_playoffs.game_id
INNER JOIN team_information blue_side
ON blue_side.team_id = lcs_game_information.blue_side_team
INNER JOIN team_information red_side
ON red_side.team_id = lcs_game_information.red_side_team
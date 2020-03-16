select team_name as Team, team_information.team_id as tID, player_information.player_id as plyID, player_name as plyName, positions.position_name as posName
from team_rosters_spring_2020
inner join team_information
on team_rosters_spring_2020.team_id = team_information.team_id
inner join lcs_game_information
on lcs_game_information.red_side_team = team_information.team_id
inner join player_information 
on player_information.player_id = team_rosters_spring_2020.player_id
inner join positions
on positions.position_id = player_information.positions_position_id
where team_information.team_id = 11
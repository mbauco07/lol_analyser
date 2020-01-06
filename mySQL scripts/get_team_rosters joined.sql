SELECT * FROM team_rosters_lcs_spring_2019;

select team_name as Team, player_name as Player, position_name as Position from team_information
inner join team_rosters_lcs_spring_2019
on team_information.team_id = team_rosters_lcs_spring_2019.team_id
inner join player_information
on team_rosters_lcs_spring_2019.player_id = player_information.player_id
inner join positions
on player_information.positions_position_id = positions.position_id
order by team_information.team_namelcs_games_spring_2019
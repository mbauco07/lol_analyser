SELECT game_actions_information.gai_id, game_actions_information.game_id as gameID,  game_actions.game_action_name as action_name, player_information.player_name as plyName, game_actions_information.action_time as time, game_actions_information.player_id as plyID, game_actions_information.team_id as teamID, game_information.blue_side_team as blue, game_information.red_side_team as red FROM lol_data.game_actions_information
inner join game_actions
on game_actions_information.game_action_id = game_actions.game_action_id
inner join team_information
on game_actions_information.team_id = team_information.team_id
inner join player_information 
on	game_actions_information.player_id = player_information.player_id
inner join champs 
on game_actions_information.champ_id = champs.champ_id
inner join game_information
on game_actions_information.game_id = game_information.game_id
where game_actions_information.game_id = 1

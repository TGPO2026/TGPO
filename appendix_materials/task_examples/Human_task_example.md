# Human Task Example

Instruction:
give me some tea.

## Reply:

### Task Decomposition

1.  Pick_up_kettle_49_from_cabinet_37
2.  Fill_kettle_49_with_water_at_sink_101
3.  Place_kettle_49_on_counter_34
4.  Power_on_kettle_49_to_heat_water
5.  Pour_hot_water_from_kettle_49_into_cup_23
6.  Pick_up_cup_23_with_tea_from_counter_34
7.  Hand_over_cup_23_to_person_0_in_bedroom_1

### Subgoal Grounding

1.  Pick_up_kettle_49_from_cabinet_37
    Subtask goal: ['(holding agent_0 kettle_49)']
    Implicitly related object: []
2.  Fill_kettle_49_with_water_at_sink_101
    Subtask goal: ['(is_filled kettle_49)']
    Implicitly related object: ['sink_101']
3.  Place_kettle_49_on_counter_34
    Subtask goal: ['(item_on_surface kettle_49 counter_34)']
    Implicitly related object: []
4.  Power_on_kettle_49_to_heat_water
    Subtask goal: ['(is_powered_on kettle_49)']
    Implicitly related object: []
5.  Pour_hot_water_from_kettle_49_into_cup_23
    Subtask goal: ['(is_filled cup_23)']
    Implicitly related object: ['kettle_49', 'counter_34', 'kettle_49']
6.  Pick_up_cup_23_with_tea_from_counter_34
    Subtask goal: ['(item_on_surface tea_canister_52 cup_23)', '(holding agent_0 cup_23)']
    Implicitly related object: []
7.  Hand_over_cup_23_to_person_0_in_bedroom_1
    Subtask goal: ['(p_holding person_0 cup_23)']
    Implicitly related object: []

## Plan:

[
"(navigate agent_0 person_0 kettle_49)",
"(pick_from_surface agent_0 kettle_49 cabinet_37)",
"(navigate agent_0 kettle_49 sink_101)",
"(fill_from_faucet agent_0 kettle_49 sink_101)",
"(navigate agent_0 sink_101 counter_34)",
"(place_on_surface agent_0 kettle_49 counter_34)",
"(navigate agent_0 counter_34 kettle_49)",
"(power_on agent_0 kettle_49)",
"(navigate agent_0 kettle_49 cup_23)",
"(pick_from_surface agent_0 cup_23 table_32)",
"(navigate agent_0 table_32 cabinet_37)",
"(place_on_surface agent_0 cup_23 cabinet_37)",
"(navigate agent_0 cabinet_37 kettle_49)",
"(pick_from_surface agent_0 kettle_49 cabinet_37)",
"(pour_into agent_0 kettle_49 cup_23)",
"(navigate agent_0 cabinet_37 counter_34)",
"(place_on_surface agent_0 kettle_49 counter_34)",
"(navigate agent_0 counter_34 cabinet_37)",
"(open agent_0 cabinet_37)",
"(navigate agent_0 cabinet_37 tea_canister_52)",
"(pick_from_receptacle agent_0 tea_canister_52 cabinet_37)",
"(navigate agent_0 tea_canister_52 cup_23)",
"(place_on_surface agent_0 tea_canister_52 cup_23)",
"(navigate agent_0 kettle_49 cup_23)",
"(pick_from_surface agent_0 cup_23 cabinet_37)",
"(navigate agent_0 cup_23 person_0)",
"(hand_over_to_person agent_0 person_0 cup_23)"
]

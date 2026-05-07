# Complex Task Example

## Instruction:
Collect scissors, tape, and colored pencils from the closet, office, and bedrooms. Set up all materials on the kitchen table for a family craft night, then power on the multiport hub in the living room so everyone can charge their devices during the activity. Afterwards, clean up by putting all used materials back in their original rooms.

## Reply:
### Task Decomposition ###
   1. collect_and_place_scissors_on_kitchen_table
   2. collect_and_place_tape_next_to_scissors_on_kitchen_table
   3. collect_and_place_colored_pencils_next_to_tape_on_kitchen_table
   4. power_on_multiport_hub_in_living_room
   5. return_scissors_to_shelves_17_in_closet_1
   6. return_tape_to_table_29_in_office_1
   7. return_colored_pencils_to_table_19_in_bedroom_2

### Subgoal Grounding ###
   1. collect_and_place_scissors_on_kitchen_table
      Subtask goal: ['(item_on_surface scissors_1 kitchen_table_invented_1)']
      Implicitly related object: []
   2. collect_and_place_tape_next_to_scissors_on_kitchen_table
      Subtask goal: ['(next_to tape_2 scissors_1 kitchen_table_invented_1)', '(item_on_surface tape_2 kitchen_table_invented_1)']
      Implicitly related object: []
   3. collect_and_place_colored_pencils_next_to_tape_on_kitchen_table
      Subtask goal: ['(next_to colored_pencils_3 tape_2 kitchen_table_invented_1)', '(item_on_surface colored_pencils_3 kitchen_table_invented_1)']
      Implicitly related object: []
   4. power_on_multiport_hub_in_living_room
      Subtask goal: ['(is_powered_on multiport_hub_3)']
      Implicitly related object: []
   5. return_scissors_to_shelves_17_in_closet_1
      Subtask goal: ['(item_on_surface scissors_1 shelves_17)']
      Implicitly related object: []
   6. return_tape_to_table_29_in_office_1
      Subtask goal: ['(item_on_surface tape_2 table_29)']
      Implicitly related object: []
   7. return_colored_pencils_to_table_19_in_bedroom_2
      Subtask goal: ['(item_on_surface colored_pencils_3 table_19)']
      Implicitly related object: []

## Plan:
[
  "(navigate agent_1 floor_hallway_1 kitchen_table_invented_1)",
  "(navigate agent_1 kitchen_table_invented_1 scissors_1)",
  "(pick_from_surface agent_1 scissors_1 shelves_17)",
  "(navigate agent_1 scissors_1 kitchen_table_invented_1)",
  "(place_on_surface agent_1 scissors_1 kitchen_table_invented_1)",
  "(navigate agent_1 kitchen_table_invented_1 tape_2)",
  "(pick_from_surface agent_1 tape_2 table_29)",
  "(navigate agent_1 tape_2 kitchen_table_invented_1)",
  "(place_next_to_surface agent_1 tape_2 scissors_1 kitchen_table_invented_1)",
  "(navigate agent_1 kitchen_table_invented_1 colored_pencils_3)",
  "(pick_from_surface agent_1 colored_pencils_3 table_19)",
  "(navigate agent_1 colored_pencils_3 kitchen_table_invented_1)",
  "(place_next_to_surface agent_1 colored_pencils_3 tape_2 kitchen_table_invented_1)",
  "(navigate agent_1 kitchen_table_invented_1 multiport_hub_3)",
  "(power_on agent_1 multiport_hub_3)",
  "(navigate agent_1 multiport_hub_3 scissors_1)",
  "(pick_from_surface agent_1 scissors_1 kitchen_table_invented_1)",
  "(navigate agent_1 scissors_1 shelves_17)",
  "(place_on_surface agent_1 scissors_1 shelves_17)",
  "(navigate agent_1 shelves_17 table_29)",
  "(navigate agent_1 table_29 tape_2)",
  "(pick_from_surface agent_1 tape_2 kitchen_table_invented_1)",
  "(navigate agent_1 tape_2 table_29)",
  "(place_on_surface agent_1 tape_2 table_29)",
  "(navigate agent_1 table_29 colored_pencils_3)",
  "(pick_from_surface agent_1 colored_pencils_3 kitchen_table_invented_1)",
  "(navigate agent_1 colored_pencils_3 table_19)",
  "(place_on_surface agent_1 colored_pencils_3 table_19)"
]
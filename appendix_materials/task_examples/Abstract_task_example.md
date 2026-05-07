# Abstract Task Example
## Instruction:
Create a classy dinner atmosphere and tidy afterward

## Reply:
### Task Decomposition ###
   1. Pick_up_tablecloth_20_from_dining_table_18
   2. Place_tablecloth_20_on_dining_table_18
   3. Pick_up_centerpiece_84_from_dining_table_18
   4. Place_centerpiece_84_next_to_tablecloth_20
   5. Pick_up_candle_113_from_dining_table_18
   6. Place_candle_113_next_to_centerpiece_84
   7. Pick_up_salt_shaker_58_from_dining_table_18
   8. Place_salt_shaker_58_next_to_candle_113
   9. Pick_up_pepper_grinder_59_from_dining_table_18
   10. Place_pepper_grinder_59_next_to_salt_shaker_58
   11. Pick_up_candle_141_from_dining_table_18
   12. Place_candle_141_next_to_pepper_grinder_59
   13. Pick_up_napkin_holder_22_from_dining_table_20
   14. Place_napkin_holder_22_next_to_candle_141
   15. Pick_up_wine_bottle_142_from_dining_table_20
   16. Place_wine_bottle_142_next_to_napkin_holder_22

### Subgoal Grounding ###
   1. Pick_up_tablecloth_20_from_dining_table_18
      Subtask goal: ['(holding agent_0 tablecloth_20)']
      Implicitly related object: []
   2. Place_tablecloth_20_on_dining_table_18
      Subtask goal: ['(item_on_surface tablecloth_20 dining_table_18)']
      Implicitly related object: []
   3. Pick_up_centerpiece_84_from_dining_table_18
      Subtask goal: ['(holding agent_0 centerpiece_84)']
      Implicitly related object: []
   4. Place_centerpiece_84_next_to_tablecloth_20
      Subtask goal: ['(next_to centerpiece_84 tablecloth_20 dining_table_18)']
      Implicitly related object: []
   5. Pick_up_candle_113_from_dining_table_18
      Subtask goal: ['(holding agent_0 candle_113)']
      Implicitly related object: []
   6. Place_candle_113_next_to_centerpiece_84
      Subtask goal: ['(next_to candle_113 centerpiece_84 dining_table_18)']
      Implicitly related object: []
   7. Pick_up_salt_shaker_58_from_dining_table_18
      Subtask goal: ['(holding agent_0 salt_shaker_58)']
      Implicitly related object: []
   8. Place_salt_shaker_58_next_to_candle_113
      Subtask goal: ['(next_to salt_shaker_58 candle_113 dining_table_18)']
      Implicitly related object: []
   9. Pick_up_pepper_grinder_59_from_dining_table_18
      Subtask goal: ['(holding agent_0 pepper_grinder_59)']
      Implicitly related object: []
   10. Place_pepper_grinder_59_next_to_salt_shaker_58
      Subtask goal: ['(next_to pepper_grinder_59 salt_shaker_58 dining_table_18)']
      Implicitly related object: []
   11. Pick_up_candle_141_from_dining_table_18
      Subtask goal: ['(holding agent_0 candle_141)']
      Implicitly related object: []
   12. Place_candle_141_next_to_pepper_grinder_59
      Subtask goal: ['(next_to candle_141 pepper_grinder_59 dining_table_18)']
      Implicitly related object: []
   13. Pick_up_napkin_holder_22_from_dining_table_20
      Subtask goal: ['(holding agent_0 napkin_holder_22)']
      Implicitly related object: []
   14. Place_napkin_holder_22_next_to_candle_141
      Subtask goal: ['(next_to napkin_holder_22 candle_141 dining_table_18)']
      Implicitly related object: []
   15. Pick_up_wine_bottle_142_from_dining_table_20
      Subtask goal: ['(holding agent_0 wine_bottle_142)']
      Implicitly related object: []
   16. Place_wine_bottle_142_next_to_napkin_holder_22
      Subtask goal: ['(next_to wine_bottle_142 napkin_holder_22 dining_table_18)']
      Implicitly related object: []

## Plan:
[
  "(navigate agent_0 bathroom_5 tablecloth_20)",
  "(pick_from_surface agent_0 tablecloth_20 dining_table_45)",
  "(navigate agent_0 tablecloth_20 dining_table_18)",
  "(place_on_surface agent_0 tablecloth_20 dining_table_18)",
  "(navigate agent_0 dining_table_18 centerpiece_84)",
  "(pick_from_surface agent_0 centerpiece_84 dining_table_45)",
  "(navigate agent_0 centerpiece_84 dining_table_18)",
  "(place_next_to_surface agent_0 centerpiece_84 tablecloth_20 dining_table_18)",
  "(navigate agent_0 dining_table_18 candle_113)",
  "(pick_from_surface agent_0 candle_113 dining_table_18)",
  "(navigate agent_0 candle_113 dining_table_18)",
  "(place_next_to_surface agent_0 candle_113 centerpiece_84 dining_table_18)",
  "(navigate agent_0 dining_table_18 salt_shaker_58)",
  "(pick_from_surface agent_0 salt_shaker_58 dining_table_18)",
  "(navigate agent_0 salt_shaker_58 dining_table_18)",
  "(place_next_to_surface agent_0 salt_shaker_58 candle_113 dining_table_18)",
  "(navigate agent_0 dining_table_18 pepper_grinder_59)",
  "(pick_from_surface agent_0 pepper_grinder_59 dining_table_18)",
  "(navigate agent_0 pepper_grinder_59 dining_table_18)",
  "(place_next_to_surface agent_0 pepper_grinder_59 salt_shaker_58 dining_table_18)",
  "(navigate agent_0 dining_table_18 candle_141)",
  "(pick_from_surface agent_0 candle_141 dining_table_18)",
  "(navigate agent_0 candle_141 dining_table_18)",
  "(place_next_to_surface agent_0 candle_141 pepper_grinder_59 dining_table_18)",
  "(navigate agent_0 dining_table_18 napkin_holder_22)",
  "(pick_from_surface agent_0 napkin_holder_22 dining_table_46)",
  "(navigate agent_0 napkin_holder_22 dining_table_18)",
  "(place_next_to_surface agent_0 napkin_holder_22 candle_141 dining_table_18)",
  "(navigate agent_0 dining_table_18 wine_bottle_142)",
  "(pick_from_surface agent_0 wine_bottle_142 dining_table_20)",
  "(navigate agent_0 wine_bottle_142 dining_table_18)",
  "(place_next_to_surface agent_0 wine_bottle_142 napkin_holder_22 dining_table_18)"
]
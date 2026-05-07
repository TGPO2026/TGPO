(define (domain domain_final)
  (:requirements :strips :typing :equality
    :disjunctive-preconditions
    :existential-preconditions
    :conditional-effects
  )

  (:types
    item
    agent - item
    location - item
      person - location
      physobj - location
        room - physobj
        furniture - physobj
        device - physobj
        object - physobj
          container - object
    )

  (:predicates
    (person_at ?p - person ?loc - physobj)
    (p_holding ?p - person ?i - physobj)
    (agent_at ?a - agent ?loc - location)
    (holding ?a - agent ?i - physobj)
    (handempty ?a - agent)
    (item_on_surface ?i - physobj ?s - physobj)
    (item_in_receptacle ?i - physobj ?r - physobj)
    (furniture_in_room ?f - furniture ?r - room)
    (device_in_room ?d - device ?r - room)
    (next_to ?i1 - physobj ?i2 - physobj ?s - physobj)
    (can_only_place_one_object ?o - physobj)
    (can_be_moved ?o - physobj)
    (can_be_opened ?c - physobj)
    (is_open ?c - physobj)
    (is_cleaning_tool ?o - physobj)
    (is_clean ?p - physobj)
    (requires_water_to_clean ?o - physobj)
    (require_floor_cleaner ?r - room)
    (is_floor_cleaner ?f - physobj)
    (has_faucet ?f - physobj)
    (is_filled ?p - physobj)
    (can_dispense ?d - physobj)
    (is_powerable ?p - physobj)
    (is_powered_on ?p - physobj)
    (is_heating_device ?p - physobj)
    (is_heater ?p - physobj)
    (is_heated ?p - physobj)
    (is_light_on ?c - object)
  )

  ; Action: navigate
  (:action navigate
    :parameters (?ag - agent ?from - location ?to - location)
    :precondition (and (agent_at ?ag ?from) (not (= ?from ?to)))
    :effect (and (agent_at ?ag ?to) (not (agent_at ?ag ?from)))
  )

  ; Action: pick_from_surface
  (:action pick_from_surface
    :parameters (?ag - agent ?obj - physobj ?surface - physobj)
    :precondition (and
      (agent_at ?ag ?obj)
      (item_on_surface ?obj ?surface)
      (handempty ?ag)
      (not (exists (?other_obj - physobj) (item_on_surface ?other_obj ?obj)))
    )
    :effect (and
      (not (item_on_surface ?obj ?surface))
      (holding ?ag ?obj)
      (not (handempty ?ag))
    )
  )

  ; Action: place_on_surface
  (:action place_on_surface
    :parameters (?ag - agent ?obj - physobj ?surface - physobj)
    :precondition (and
        (agent_at ?ag ?surface)
        (holding ?ag ?obj)
        (not (= ?obj ?surface))
        (not (item_on_surface ?surface ?obj))
        (imply (can_only_place_one_object ?surface)
               (not (exists (?any_obj - physobj) (item_on_surface ?any_obj ?surface)))
        )
    )
    :effect (and
        (item_on_surface ?obj ?surface)
        (handempty ?ag)
        (not (holding ?ag ?obj))
    )
)

  ; Action: pick_from_receptacle
  (:action pick_from_receptacle
    :parameters (?ag - agent ?obj - physobj ?r - physobj)
    :precondition (and (agent_at ?ag ?obj) (item_in_receptacle ?obj ?r)  (is_open ?r) (handempty ?ag))
    :effect (and (not (item_in_receptacle ?obj ?r)) (holding ?ag ?obj) (not (handempty ?ag)))
  )

  ; Action: place_in_receptacle
  (:action place_in_receptacle
    :parameters (?ag - agent ?obj - physobj ?r - physobj)
    :precondition (and (agent_at ?ag ?r) (holding ?ag ?obj)  (is_open ?r) (not (= ?obj ?r))
    )
    :effect (and (item_in_receptacle ?obj ?r) (handempty ?ag) )
  )

  ; Action: open
  (:action open
    :parameters (?ag - agent ?r - physobj)
    :precondition (and (agent_at ?ag ?r) (can_be_opened ?r) (not (is_open ?r)) (handempty ?ag))
    :effect (is_open ?r)
  )

  ; Action: close
  (:action close
    :parameters (?ag - agent ?r - physobj)
    :precondition (and (agent_at ?ag ?r)  (is_open ?r) (handempty ?ag))
    :effect (not (is_open ?r))
  )

  ; Action: power_on
  (:action power_on
    :parameters (?ag - agent ?p - physobj)
    :precondition (and (agent_at ?ag ?p) (is_powerable ?p) (not (is_powered_on ?p)) (handempty ?ag))
    :effect (and (is_powered_on ?p))
  )

  ; Action: power_off
  (:action power_off
    :parameters (?ag - agent ?p - physobj)
    :precondition (and (agent_at ?ag ?p) (is_powerable ?p) (is_powered_on ?p) (handempty ?ag))
    :effect (not (is_powered_on ?p))
  )

  ; Action: fill_from_faucet
  (:action fill_from_faucet
    :parameters (?ag - agent ?c - physobj ?faucet_loc - physobj)
    :precondition (and (agent_at ?ag ?faucet_loc) (holding ?ag ?c) (has_faucet ?faucet_loc) (not (is_filled ?c)))
    :effect (is_filled ?c)
  )

  (:action dispense_from_device
    :parameters (?ag - agent ?d - physobj ?c - physobj)
    :precondition (and
        (agent_at ?ag ?d)
        (item_on_surface ?c ?d)
        (can_dispense ?d)
        (is_powered_on ?d)
        (not (is_filled ?c))
    )
    :effect (is_filled ?c)
  )

  ; Action: pour_into
  (:action pour_into
    :parameters (?ag - agent ?c - physobj ?target - physobj)
    :precondition (and (holding ?ag ?c) (is_filled ?c) (agent_at ?ag ?target)
      (not (is_filled ?target)))
    :effect (and
              (not (is_filled ?c))
              (is_filled ?target)
              (when (is_heated ?c)
                (is_heated ?target)
              )
            )
  )

  (:action place_next_to_surface
    :parameters (?ag - agent ?obj_to_place - physobj ?obj_reference - physobj ?surface - furniture)
    :precondition (and
      (agent_at ?ag ?surface)
      (holding ?ag ?obj_to_place)
      (item_on_surface ?obj_reference ?surface)
      (not (= ?obj_to_place ?obj_reference))
      (not (= ?obj_to_place ?surface))
      (not (= ?obj_reference ?surface))
    )
    :effect (and
      (item_on_surface ?obj_to_place ?surface)
      (next_to ?obj_to_place ?obj_reference ?surface)
      (next_to ?obj_reference ?obj_to_place ?surface)
      (handempty ?ag)
      (not (holding ?ag ?obj_to_place))
    )
  )
  (:action place_next_to_inside
    :parameters (?ag - agent ?obj_to_place - physobj ?obj_reference - physobj ?receptacle - physobj)
    :precondition (and
      (agent_at ?ag ?receptacle)
      (holding ?ag ?obj_to_place)
      (item_in_receptacle ?obj_reference ?receptacle)
      (is_open ?receptacle)
      (not (= ?obj_to_place ?obj_reference))
      (not (= ?obj_to_place ?receptacle))
      (not (= ?obj_reference ?receptacle))
    )
    :effect (and
      (item_in_receptacle ?obj_to_place ?receptacle)
      (next_to ?obj_to_place ?obj_reference ?receptacle)
      (next_to ?obj_reference ?obj_to_place ?receptacle)
      (handempty ?ag)
      (not (holding ?ag ?obj_to_place))
    )
  )
  (:action clean_item_with_faucet
    :parameters (?ag - agent ?obj - physobj ?faucet_loc - physobj)
    :precondition (and (agent_at ?ag ?faucet_loc) (holding ?ag ?obj) (has_faucet ?faucet_loc) (not (is_clean ?obj)) (not (is_filled ?obj))
     (requires_water_to_clean ?obj) )
    :effect (is_clean ?obj)
  )
  (:action clean_item
    :parameters (?ag - agent ?obj - physobj ?target - object)
    :precondition (and (holding ?ag ?obj) (not (is_clean ?target)) (is_cleaning_tool ?obj) (not (= ?obj ?target))
      (not (requires_water_to_clean ?target)))
    :effect (is_clean ?target)
  )
  (:action clean_furniture
    :parameters (?ag - agent ?obj - physobj ?f - furniture )
    :precondition (and (agent_at ?ag ?f) (not (is_clean ?f)) (holding ?ag ?obj) (not (= ?obj ?f))
      (is_cleaning_tool ?obj)
      (not (requires_water_to_clean ?f)))
    :effect (is_clean ?f)
  )
  (:action clean_room_floor
    :parameters (?ag - agent ?obj - physobj ?r - room)
    :precondition (and (agent_at ?ag ?r) (not (is_clean ?r)) (holding ?ag ?obj) (not (= ?obj ?r))
      (is_floor_cleaner ?obj) (require_floor_cleaner ?r))
    :effect (is_clean ?r)
  )
  (:action fill_device_with_water
    :parameters (?ag - agent ?d - physobj)
    :precondition (and (agent_at ?ag ?d) (not (is_filled ?d)) (has_faucet ?d))
    :effect (is_filled ?d)
  )
  (:action pour
    :parameters (?ag - agent ?c - physobj ?furn_with_faucet - furniture)
    :precondition (and (holding ?ag ?c) (is_filled ?c) (agent_at ?ag ?furn_with_faucet)
      (has_faucet ?furn_with_faucet))
    :effect (and
              (not (is_filled ?c))
              (not (is_heated ?c))
            )
  )
  (:action light_on
    :parameters (?ag - agent ?obj - object)
    :precondition (agent_at ?ag ?obj)
    :effect (is_light_on ?obj)
  )
  (:action move_furniture_to_room
    :parameters (?ag - agent ?f - furniture ?from - room ?to - room)
    :precondition (and
        (can_be_moved ?f)
        (agent_at ?ag ?f)
        (furniture_in_room ?f ?from)
        (not (= ?from ?to))
        (handempty ?ag)
        (not (exists (?other_obj - physobj) (item_on_surface ?other_obj ?f)))
        (not (exists (?other_obj - physobj) (item_in_receptacle ?other_obj ?f)))
    )

    :effect (and
        (not (furniture_in_room ?f ?from))
        (furniture_in_room ?f ?to)
        (agent_at ?ag ?to)
    )
)
  (:action move_device_to_room
    :parameters (?ag - agent ?d - device ?from - room ?to - room)
    :precondition (and (can_be_moved ?d) (agent_at ?ag ?d) (device_in_room ?d ?from) (not (= ?from ?to)) (handempty ?ag))
    :effect (and (not (device_in_room ?d ?from)) (device_in_room ?d ?to) (agent_at ?ag ?to))
  )
  (:action hand_over_to_person
    :parameters (?ag - agent ?p - person ?obj - physobj)
    :precondition (and (agent_at ?ag ?p) (holding ?ag ?obj)  (not (= ?ag ?p)))
    :effect (and
      (p_holding ?p ?obj)
      (handempty ?ag)
    )
  )
)
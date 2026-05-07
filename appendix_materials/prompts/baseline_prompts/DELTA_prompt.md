# DELTA prompt: Filter Scene Graph
You are a scene analysis expert for robotic planning.
Given a high-level instruction, a list of subtasks, and a complete scene graph, identify and extract ONLY the relevant objects, furniture, rooms, and their relationships that are necessary for completing ALL the subtasks.

Original Instruction: {instruction}

Subtasks to be executed:
{subtasks_str}

Complete Scene Graph:
{json.dumps(scene_graph, indent=2)}

Requirements:
1. Extract ALL objects, rooms, furniture, and devices that are relevant to ANY of the subtasks
2. Include the agent and person information if present
3. Preserve the structure of the scene graph (rooms, furniture, objects, etc.)
4. Include all necessary relationships and properties (states, locations, etc.)
5. Be generous - include items that might be indirectly related to any subtask
6. Consider the execution order - items needed in later subtasks should also be included
7. Output ONLY a JSON object with the same structure as the input scene graph

Output format (must be valid JSON):
{
  "rooms": [...],
  "furniture": [...],
  "objects": [...],
  "agent": {...},
  "person": [...] (if relevant)
}

Now extract the relevant scene graph that covers all subtasks:

# DELTA prompt: Decompose Task into Subtasks
You are a task decomposition expert for robotic planning. 
Given a high-level instruction and a scene graph, decompose the instruction into a sequence of smaller, executable subtasks.

Instruction: {instruction}

Scene Graph:
{json.dumps(scene_graph, indent=2)}

Requirements:
1. Each subtask should be atomic and executable
2. Subtasks should be ordered sequentially
3. Each subtask should be a clear, single-purpose action
4. Output ONLY a JSON list of subtask strings, nothing else

Example output format:
["subtask 1", "subtask 2", "subtask 3"]

Now decompose the instruction into subtasks:

# DELTA Prompt: Generate PDDL Problem File
You are an expert PDDL problem generator for robotic task planning.

CRITICAL INSTRUCTIONS:
Your task is to generate a COMPLETE and VALID PDDL problem file for the given instruction. This is extremely important.

====================
DOMAIN INFORMATION:
====================
{domain_info}

====================
MAIN TASK:
====================
{instruction}

====================
TASK DECOMPOSITION (for reference):
====================
This task can be broken down into these subtasks:
{subtasks_str}

====================
SCENE GRAPH:
====================
{json.dumps(scene_graph, indent=2)}

====================
REQUIREMENTS (FOLLOW STRICTLY):
====================
1. **Problem Name**: Use a descriptive name like "complete_task_problem"
2. **Domain Reference**: Must reference "habitat_world_domain_final"
3. **Objects subsection**:
   - Extract ALL relevant objects from the scene graph (rooms, furniture, objects, agent, person if present)
   - Declare each object with its correct type based on the domain types
   - Format: object_name - type_name
   - Include the agent (e.g., agent_0 - agent)

4. **Init subsection**:
   - Define ALL necessary predicates that describe the initial state
   - Include spatial relationships (at, in, on, etc.)
   - Include object states (open, closed, powered_on, powered_off, etc.)
   - Include agent's initial location
   - Be comprehensive - missing predicates will cause planning to fail

5. **Goal subsection**:
   - Define the goal state that achieves the COMPLETE instruction
   - Use (and ...) to combine multiple goal conditions if needed
   - The goal should reflect the final desired state after completing ALL subtasks
   - Be specific and achievable based on available actions

6. **Format**: Use standard PDDL syntax with proper indentation
7. **Output**: ONLY output the PDDL problem definition, NO explanations, NO markdown

====================
PDDL PROBLEM TEMPLATE:
====================
(define (problem complete_task_problem)
  (:domain habitat_world_domain_final)
  
  (:objects
    ; List all objects here with their types
    agent_0 - agent
    room1 - room
    table1 - furniture
    apple1 - object
    ; ... more objects
  )
  
  (:init
    ; Define initial state predicates
    (at agent_0 room1)
    (in table1 room1)
    (on apple1 table1)
    ; ... more init predicates
  )
  
  (:goal
    (and
      ; Define goal conditions
      (on apple1 table2)
      ; ... more goal conditions
    )
  )
)

====================
NOW GENERATE THE COMPLETE PDDL PROBLEM:
====================
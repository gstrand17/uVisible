export function assignTasks(members, newInstances, existingAssignments) {
    const labor_weight_map = {
        low: 1,
        medium: 2,
        high: 3,
        extreme: 4
    };

    //Initialize members with existing workload
    const updatedMembers = members.map(member => {

        const memberExisting = existingAssignments.filter(
            a => a.memID === member.memID
        );

        const existingLoad = memberExisting.reduce((total, assignment) => {

            const duration = assignment.TaskTemplate?.duration || 0;
            const labor = assignment.TaskTemplate?.labor || "low";

            const weight =
                duration * labor_weight_map[labor];

            return total + weight;

        }, 0);

        return {
            ...member,
            current_load_score: existingLoad,
            assigned_tasks: []
        };
    });

    const unassignable_tasks = [];

    for (const task of newInstances) {

        const eligible_members = [];

        for (const member of updatedMembers) {

            if (task.adult_only && !member.is_adult) {
                continue;
            }

            if (labor_weight_map[task.labor] > member.labor_limit) {
                continue;
            }

            eligible_members.push(member);
        }

        if (eligible_members.length === 0) {
            unassignable_tasks.push(task);
            continue;
        }

        // Sort ascending by current load
        eligible_members.sort(
            (a, b) => a.current_load_score - b.current_load_score
        );

        const selected_member = eligible_members[0];

        const task_weight =
            task.duration * labor_weight_map[task.labor];

        console.log({
            assignedTo: selected_member.memName,
            taskTitle: task.title,
            duration: task.duration,
            labor: task.labor,
            weight: task_weight
        });

        selected_member.current_load_score += task_weight;
        selected_member.assigned_tasks.push(task);
    }

    return {
        members: updatedMembers,
        unassignable_tasks
    };
}
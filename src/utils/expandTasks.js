export function expandTasks(taskTemplates) {
    const today = new Date();
    const instances = [];

    for (const task of taskTemplates) {

        const createInstance = (date) => ({
            ...task,
            scheduled_date: date.toISOString().split("T")[0]
        });

        if (task.freq === "daily") {
            for (let i = 1; i <= 30; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                instances.push(createInstance(date));
            }
        }

        else if (task.freq === "weekly") {
            for (let i = 1; i <= 4; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + (7 * i));
                instances.push(createInstance(date));
            }
        }

        else if (task.freq === "monthly") {
            const date = new Date(today);
            date.setMonth(today.getMonth() + 1);
            instances.push(createInstance(date));
        }

        else if (task.freq === "date-specific" && task.spec_date) {
            instances.push({
                ...task,
                taskID: task.taskID,
                scheduled_date: task.spec_date
            });
        }
    }

    return instances;
}
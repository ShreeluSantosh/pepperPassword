function performTask() {
    // Your task/function to be performed
    console.log("Performing pepper rotation every 90 days");
}

function scheduleNextExecution() {
    // Get the current date
    const currentDate = new Date();
    
    // Calculate milliseconds until the next execution (90 days)
    const millisecondsInADay = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    const millisecondsIn90Days = 90 * millisecondsInADay;
    
    // Calculate the time until the next execution
    const nextExecutionTime = new Date(currentDate.getTime() + millisecondsIn90Days);
    
    // Calculate the delay until the next execution
    const delay = nextExecutionTime.getTime() - currentDate.getTime();
    
    // Schedule the next execution
    setTimeout(function() {
        performTask();
        // Reschedule the task for the next 90 days
        scheduleNextExecution();
    }, delay);
}

// Start the timer
scheduleNextExecution();

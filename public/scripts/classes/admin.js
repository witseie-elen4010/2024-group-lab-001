const viewLogsButton = document.getElementById('viewLogsButton');

viewLogsButton.addEventListener('click', () => {
    fetch('/api/list') // Returns a Promise for the GET request
        .then(function (response) {
            // Check if the request returned a valid code
            if (response.ok) { return response.json() } // Return the response parse as JSON
            else { throw 'Failed to load classlist: response code invalid!' }
        })
        .then(function (data) { // Display the JSON data appropriately
            // Retrieve the classList outer element
            const logsList = document.getElementById('logsContent')
            logsList.innerHTML = '' // Clear the current list

            // Iterate through all logs
            if (data.length === 0) {
                const li = document.createElement('LI')
                const liText = document.createTextNode('Awaiting logs, please wait and try again.')
                li.appendChild(liText)
                logsList.appendChild(li)
            }
            else{
                data.forEach(function (log) {
                    // Create a new list entry
                    const li = document.createElement('LI')
                    const liText = document.createTextNode(log)
                    // Append the class to the list element
                    li.className += 'log'
                    // Append list text to list item and list item to list
                    li.appendChild(liText)
                    logsList.appendChild(li)
                })
            }
        })
        .catch(function (e) { // Process error for request
            alert(e) // Displays a browser alert with the error message.
        });
});

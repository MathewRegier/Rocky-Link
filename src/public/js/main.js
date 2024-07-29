document.getElementById('nextCallButton').addEventListener('click', function() {
    fetch('/initiate-next-call', { method: 'POST' })
        .then(response => response.json())
        .then(data => alert('Response: ' + data.message))
        .catch(error => console.error('Error:', error));
});

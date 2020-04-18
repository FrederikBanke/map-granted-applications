export default (endpoint, method = 'GET', body = null) => {
    if (method === 'GET') {
        return fetch(`http://localhost:8000/api/${endpoint}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
    }
    else if (method === 'POST') {
        return fetch(`http://localhost:8000/api/${endpoint}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
    }
}
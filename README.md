## Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

`npm start`

Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

`npm test`
`npm run build`
`npm run eject`

## Backend

### Creating venv & Installing Dependencies 
```
cd backend

python3 -m venv .venv
. .venv/bin/activate                        (linux only)

pip install -r requirements.txt             (recommended)


Individually:

pip install Flask
pip install -U flask-cors
pip install python-dotenv
pip install langchain                       (core)
pip install -U langchain-google-genai       (embedding model)
pip install -U langchain-community          (vector db)
pip install -U langchain-chroma


```

### Running Flask (localhost:5000 default)
```
flask --app app run
flask --app app run --debug                 (hot reload)
```
### Remove tracked and staged files
```
git rm -r --cached backend/__pycache__
```

### Environment
```
LANGSMITH_TRACING=...
LANGSMITH_API_KEY=...
GOOGLE_API_KEY=...
```

# Export pip to requirements.txt (top level dependencies)
pip list --not-required
pip list --not-required --format=freeze > requirements.txt
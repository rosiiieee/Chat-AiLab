## Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

`npm start`

Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

`npm test`
`npm run build`
`npm run eject`

## Backend

### Creating venv & installing dependencies (linux)
```
cd backend

python3 -m venv .venv

. .venv/bin/activate

pip install Flask

pip install -U flask-cors

pip install python-dotenv

pip install --upgrade "langchain-text-splitters==0.3.0" "langchain-community==0.3.0" "langgraph==0.3.0"

pip install "langchain[google-genai]==0.3.0"

pip install "langchain-pinecone==0.2.0"


v1
pip install langchain (core)
pip install -qU  langchain-google-genai (embedding model)
pip install -qU langchain-community (vector db)
pip install -qU langchain-chroma




```

### Running Flask (localhost:5000 default)
```
flask --app app run

flask --app app run --debug (hot reload)
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
PINECONE_API_KEY=...
```

# export reqs
pip list --not-required
pip list --not-required --format=freeze > requirements.txt
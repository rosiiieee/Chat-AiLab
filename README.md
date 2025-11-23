## Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

`npm start`

Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

`npm test`
`npm run build`
`npm run eject`

## Backend

Use Python 3.12.7 -- tested and working

### Creating venv & Installing Dependencies 
```
cd backend

python3 -m venv .venv
. .venv/bin/activate                        (linux only)

> Minimal requirements (If leads to error try Full requirements):
pip install -r requirements.txt

> Full requirements:          
pip install -r requirements-full.txt

> Through Commands (!!!MUST input version from requirements text file for compatibility):

pip install Flask
pip install flask-cors
pip install python-dotenv
pip install langchain                       (core)
pip install langchain-google-genai          (embedding model & generation)
pip install langchain-openai                (embedding model & generation)
pip install langchain-community             (vector store)
pip install langchain-chroma                (vector store)
```

### Environment (.env file at backend)
```
LANGSMITH_TRACING=...       (optional)
LANGSMITH_API_KEY=...       (optional)
GOOGLE_API_KEY=...          (depreciated)
OPENAI_API_KEY=...
```

### Making Embeddings Vector Store (Chroma DB) 
```
cd backend/admin
python3 admin/rag_indexing.py     (linux)
```

### Running Flask (localhost:5000 default)
```
flask --app app run
flask --app app run --debug                 (hot reload)
```

### Other Commands
- Export pip to requirements.txt (top level dependencies): 
    - pip list --not-required
    - pip list --not-required --format=freeze > requirements.txt
- Remove tracked and staged files: git rm -r --cached backend/__pycache__
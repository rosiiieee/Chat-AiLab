## Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

`npm start`

Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

`npm test`
`npm run build`
`npm run eject`

## Backend

### Creating venv (linux)
cd backend
python3 -m venv .venv
. .venv/bin/activate
pip install Flask

### Running Flask (localhost:5000 default)
flask --app app run

## Remove tracked cache files
git rm -r --cached backend/__pycache__
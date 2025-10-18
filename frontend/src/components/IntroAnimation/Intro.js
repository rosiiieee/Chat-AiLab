import alab from '../../draft_alab.gif';
import '../../App.css';

function Intro() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={alab} className="App-logo" alt="logo" />
        <p>
          <b> Hi :D </b>
        </p>
      </header>     
    </div>
  );
}

export default Intro;
import { useEffect, useState } from "react";
import "../CSS/App.css";
import icon from "/public/icons/128x128.png";
import Thanks from "./Thanks";

const App = () => {
  const [isThankYouVisible, setisThankYouVisible] = useState(false);

  const optOutLogic = async () => {
    const mellowtel = new Mellowtel("a4b864c8");
    await mellowtel.optOut();

    setisThankYouVisible(true);
  };

  const optInLogic = async () => {
    const mellowtel = new Mellowtel("a4b864c8");
    await mellowtel.optIn();
    await mellowtel.start();

    setisThankYouVisible(true);
  };

  return isThankYouVisible ? (
    <Thanks />
  ) : (
    <div className="container">
      <div className="ad-skipper-mark">
        <img src={icon} id="icon" />
        <p>Ad Skipper</p>
      </div>
      <div>
        <h1>
          Welcome to&nbsp;
          <img src={icon} id="icon" />
          Ad Skipper
        </h1>
      </div>
      <p className="intro">
        Hi 👋, Happy to announce the release of this extension that will help
        maintain it free and available to everybody...but it requires action
        from you!
      </p>
      <div className="details">
        This release includes the open-source&nbsp;
        <a
          href="https://www.mellowtel.it/mellowtel-user-guide/"
          target="_blank"
        >
          Mellowtel
        </a>
        &nbsp;library. By opting in now, you are helping to maintain this
        extension to be free and available. In case you change your mind, you
        can opt out at any time.
        <div className="buttons">
          <button
            id="optOut"
            className="button button-secondary"
            onClick={optOutLogic}
          >
            Decline Optional Use
          </button>
          <button id="optIn" className="button" onClick={optInLogic}>
            Accept and Continue
          </button>
        </div>
        <div className="policy-container">
          <p className="policy-text">
            Mellowtel shares your bandwidth only. Security and privacy are 100%
            guaranteed and the library is open source for everyone to see. It
            doesn't collect, share, or sell personal information (not even
            anonymized data). It's also highly regulated: Mellowtel keeps
            communicating with Chrome Web Store regulators to guarantee a safe
            experience. It also provides CWS regulators with tools to monitor
            and enforce compliance. Thanks!
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;

import { useRouteError } from "react-router-dom";
import "./output.css";
export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="background">
      <div id="error-page" className="block">
        <div>
          <h1>🤡Oops!</h1>
        </div>
        <div>
        <p>Sorry, an unexpected error has occurred.</p>
        </div>
        <div>
          <p>
            <i>{error.statusText || error.message}</i>
          </p>
        </div>
      </div>
    </div>
  );
}
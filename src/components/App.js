import React from "react";
import { Switch, Route } from "react-router-dom";
import Stakepools from "./Stakepools";

export default function App() {

  return (
    <main className="mt-10">
      <Switch>
        <Route path="/stakepools/:categoryName?" exact>
          <Stakepools />
        </Route>
      </Switch>
    </main>
  );
}

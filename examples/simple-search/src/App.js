import React from "react";

import { Pipeline, Values, valuesChangedEvent } from "sajari-react/controllers";
import { AutocompleteInput } from "sajari-react/ui/text";
import { Response, Results, Summary, Paginator } from "sajari-react/ui/results";

import "sajari-react/ui/text/AutocompleteInput.css";
import "sajari-react/ui/results/Results.css";
import "sajari-react/ui/results/Paginator.css";

const pipeline = new Pipeline("sajariptyltd", "sajari-com", "website");
const values = new Values();

values.listen(valuesChangedEvent, (changes, set) => {
  if (!changes.page) {
    set({ page: "1" });
  }
});

const App = () =>
  <div className="searchApp">
    <AutocompleteInput values={values} pipeline={pipeline} />
    <Response pipeline={pipeline}>
      <Summary values={values} pipeline={pipeline} />
      <Results pipeline={pipeline} />
      <Paginator values={values} pipeline={pipeline} />
    </Response>
  </div>;

export default App;

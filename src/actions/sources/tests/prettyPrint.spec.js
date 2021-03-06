import {
  actions,
  selectors,
  createStore,
  makeSource
} from "../../../utils/test-head";
import { createPrettySource } from "../prettyPrint";
import { sourceThreadClient } from "../../tests/helpers/threadClient.js";

describe("sources - pretty print", () => {
  const { dispatch, getState } = createStore(sourceThreadClient);

  it("returns a pretty source for a minified file", async () => {
    const url = "base.js";
    const source = makeSource(url);
    await dispatch(actions.newSource(source));
    await dispatch(createPrettySource(url));

    const prettyURL = `${source.url}:formatted`;
    const pretty = selectors.getSourceByURL(getState(), prettyURL);
    expect(pretty.get("contentType")).toEqual("text/javascript");
    expect(pretty.get("url").includes(prettyURL)).toEqual(true);
    expect(pretty).toMatchSnapshot();
  });

  it("should create a source when first toggling pretty print", async () => {
    const source = makeSource("foobar.js", { loadedState: "loaded" });
    await dispatch(actions.togglePrettyPrint(source));
    expect(selectors.getSources(getState()).size).toEqual(2);
  });

  it("should not make a second source when toggling pretty print", async () => {
    const source = makeSource("foobar.js", { loadedState: "loaded" });
    await dispatch(actions.togglePrettyPrint(source));
    expect(selectors.getSources(getState()).size).toEqual(2);
    await dispatch(actions.togglePrettyPrint(source.id));
    expect(selectors.getSources(getState()).size).toEqual(2);
  });
});

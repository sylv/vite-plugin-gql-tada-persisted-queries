export interface Query {
  index: [number, number];
  name: string;
  source: string;
  deps: Set<string>;
}

// query = graphql(`QUERY`, [fragments])
const QUERY_PATTERN =
  /(?<name>[A-z0-9]+) = graphql\([\n ]*`(?<source>[^`]+)`[\n ]*(?:,[\n ]*\[(?<frags>[^\]]*)\])?[\n, ]*\)/g;

// todo: definitely a better way to do this
export function* getQueries(code: string): Generator<Query> {
  for (const match of code.matchAll(QUERY_PATTERN)) {
    const source = match.groups!.source!;
    const name = match.groups!.name!;
    const frags = match.groups?.frags?.split(",")
      .map((frag) => frag.trim())
      .filter((frag) => frag.length > 0); // a empty fragment will be detected if there's a trailing comma, filtering it out

    yield {
      index: [match.index, match.index + match[0].length],
      source: source,
      name: name,
      deps: frags ? new Set(frags) : new Set(),
    };
  }
}

import { QueryEngine } from "@comunica/query-sparql";
import { DataFactory } from "rdf-data-factory";
import { BindingsFactory } from "@comunica/utils-bindings-factory";
import { GRAPHDB_ENDPOINT } from "$env/static/private";
import jsonld from "jsonld";

const engine = new QueryEngine();

const DF = new DataFactory();
const BF = new BindingsFactory(DF);

export async function querygraphdbandframe(
    querystring: string,
    bindings: any = {},
    frame: any = {},
) {
    try {
        const queryOptions = {
            sources: [{ type: "sparql", value: GRAPHDB_ENDPOINT }],
            initialBindings: BF.fromRecord(bindings),
        };

        const bindingStream = await engine.queryQuads(
            querystring,
            queryOptions,
        );
        const quads = await bindingStream.toArray();
        const jsonldDoc = await jsonld.fromRDF(quads);
        const framed = await jsonld.frame(jsonldDoc, frame);
        return framed;
    } catch (error) {
        console.error(error);
    }
}

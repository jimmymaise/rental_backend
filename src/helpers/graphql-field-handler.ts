import { GraphQLResolveInfo } from 'graphql';
import { parseResolveInfo, ResolveTree, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';

export class GraphQLFieldHandler {
  graphQLResolveInfo: GraphQLResolveInfo;
  parsedInfo: ResolveTree;
  simplifiedInfo: any;

  constructor(graphQLResolveInfo: GraphQLResolveInfo) {
    this.graphQLResolveInfo = graphQLResolveInfo;
    this.parsedInfo = parseResolveInfo(this.graphQLResolveInfo) as ResolveTree;
    this.simplifiedInfo = simplifyParsedResolveInfoFragmentWithType(this.parsedInfo,
      this.graphQLResolveInfo.returnType);
  }

  getIncludeForRelationalFields(fields: Array<string>) {
    let include = {};
    fields.forEach((fieldName, index) => include[fieldName] = (fieldName in this.simplifiedInfo.fields));
    return include;
  }

}

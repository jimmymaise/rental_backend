import { GraphQLResolveInfo } from 'graphql';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

export interface IncludeNestFieldDTO {
  fieldName: string;
  fieldPath: string;
}

export class GraphQLFieldHandler {
  graphQLResolveInfo: GraphQLResolveInfo;
  parsedInfo: ResolveTree;
  simplifiedInfo: any;

  constructor(graphQLResolveInfo: GraphQLResolveInfo) {
    this.graphQLResolveInfo = graphQLResolveInfo;
    this.parsedInfo = parseResolveInfo(this.graphQLResolveInfo) as ResolveTree;
    this.simplifiedInfo = simplifyParsedResolveInfoFragmentWithType(
      this.parsedInfo,
      this.graphQLResolveInfo.returnType,
    );
  }

  getIncludeForRelationalFields(fields: Array<string>) {
    let include = {};
    fields.forEach(
      (fieldName, index) =>
        (include[fieldName] = fieldName in this.simplifiedInfo.fields),
    );
    return include;
  }

  getIncludeForNestedRelationalFields(
    includeNestFields: IncludeNestFieldDTO[],
  ) {
    let include = {};
    includeNestFields.forEach(
      (includeNestField, index) =>
        (include[
          includeNestField.fieldName
        ] = this.isFieldExistsInGraphQLFieldPath(
          includeNestField.fieldName,
          includeNestField.fieldPath,
        )),
    );
    return include;
  }

  isFieldExistsInGraphQLFieldPath(fieldName, fieldPath: string) {
    let fieldPathArray = fieldPath.split('.');
    let checkObject = this.simplifiedInfo.fields;
    for (const key of fieldPathArray) {
      let isHasKeyDirectly = !!checkObject.hasOwnProperty(key);

      if (isHasKeyDirectly === true) {
        checkObject = checkObject[key];
        continue;
      }

      let isHasKeyInsideFieldsByTypeName =
        !!checkObject.hasOwnProperty('fieldsByTypeName') &&
        checkObject['fieldsByTypeName'].hasOwnProperty(key);

      if (isHasKeyInsideFieldsByTypeName === true) {
        checkObject = checkObject['fieldsByTypeName'][key];
        continue;
      }
      return false;
    }
    return checkObject.hasOwnProperty(fieldName);
  }
}

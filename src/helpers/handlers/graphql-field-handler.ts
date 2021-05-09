import { GraphQLResolveInfo } from 'graphql';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

export interface IncludeNestFieldDTO {
  fieldName: string;
  fieldPath?: string;
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
    const include = {};
    fields.forEach(
      (fieldName) =>
        (include[fieldName] = fieldName in this.simplifiedInfo.fields),
    );
    return include;
  }

  getIncludeForNestedRelationalFields(
    includeNestFields: IncludeNestFieldDTO[],
  ) {
    const include = {};
    includeNestFields.forEach(
      (includeNestField) =>
        (include[
          includeNestField.fieldName
        ] = this.isFieldExistsInGraphQLFieldPath(
          includeNestField.fieldName,
          includeNestField.fieldPath,
        )),
    );
    return include;
  }

  isFieldExistsInGraphQLFieldPath(fieldName, fieldPath?: string) {
    if (!fieldPath) {
      return this.simplifiedInfo.fields.hasOwnProperty(fieldName);
    }

    const fieldPathArray = fieldPath.split('.');
    let checkObject = this.simplifiedInfo.fields;
    for (const key of fieldPathArray) {
      const isHasKeyDirectly = !!checkObject.hasOwnProperty(key);
      if (isHasKeyDirectly === true) {
        checkObject = checkObject[key];
        continue;
      }

      const isHasKeyInsideFieldsByTypeName =
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

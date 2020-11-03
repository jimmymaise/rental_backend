import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./**/*.graphql'],
  path: join(process.cwd(), './graphql.schema.ts'),
  outputAs: 'class',
  watch: true, // To enable watch mode for the script (to automatically generate typings whenever any .graphql file changes), pass the watch option to the generate() method.
});

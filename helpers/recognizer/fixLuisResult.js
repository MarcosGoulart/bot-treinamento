const _ = require('lodash');
const { inspect } =  require("util");


// override the entities property to remove the extra array on the first value
// of each type (e.g. Area: [ [Desenvolvimento], Tecnologia, Infraestrutura ])
// -> [ Desenvolvimento, Tecnologia, Infraestrutura ]
module.exports = luisResult => {
  const originalEntities = luisResult.entities;
  
  return {
    ...luisResult,
    entities: {
      $instance: originalEntities.$instance,
      ...Object.keys(originalEntities)
        .filter(key => key !== '$instance')
        .reduce(
          (acc, key) => ({ ...acc, [key]: _.flatten(originalEntities[key]) }),
          {}
        )
    }
  };
};
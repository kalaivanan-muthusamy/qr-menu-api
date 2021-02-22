export const permissionValidationSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      moduleKey: {
        type: 'string',
      },
      actionsPermitted: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
    required: ['moduleKey', 'actionsPermitted'],
    additionalProperties: false,
  },
  uniqueItems: true,
};

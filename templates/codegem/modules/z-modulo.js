const data = {
  name: 'cline',
  tableName: 'profiles',
  route: 'profiles',
  modelName: 'profile',
  transformerName: 'ProfileTransformer',
  controllerName: 'ProfileController',
  repositoryName: 'ProfileRepository',
  filterName: 'ProfileFilter',
  transformName: 'ProfileTransaformer',
  tableFields: [
    {
      type: 'string',
      name: 'name',
      required: true,
      unique: true,
      default: false,
      searchable: true,
      returnTransform: true,
    },

    // {
    //   type: 'text',
    //   name: 'long_description',
    //   required: false,
    //   unique: false,
    //   default: false,
    // },
    // { type: 'integer', name: 'tipo', required: false, unique: false, default: 2 },
    // { type: 'float', name: 'ponto_flutuante', required: true, unique: false, default: 2 },
    // {
    //   type: 'dateTime',
    //   name: 'data_inicio_default',
    //   required: true,
    //   unique: false,
    //   default: true,
    //   isDate: true,
    // },
    // {
    //   type: 'dateTime',
    //   name: 'data_inicio_obrigatoria',
    //   required: true,
    //   default: false,
    //   isDate: true,
    // },
  ],
  seeds: {
    uniqueKey: 'name',
    items: [{ name: 'ADMIN' }, { name: 'DEFAULT' }],
  },
}
exports.default = data

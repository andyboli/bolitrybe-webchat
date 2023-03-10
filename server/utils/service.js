function getFields(data) {
  return Object.fromEntries(
    Object.entries(data).filter(([key, _]) => key !== 'id' && key !== 'friends'),
  );
}

module.exports = {
  getFields,
};

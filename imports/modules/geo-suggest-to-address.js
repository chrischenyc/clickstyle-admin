const parseGmaps = (gmaps) => {
  const components = {};

  const { address_components: addressComponents } = gmaps;
  if (addressComponents !== undefined) {
    addressComponents.forEach((addressComponent) => {
      const { long_name: longName, short_name: shortName, types } = addressComponent;

      types.forEach((type) => {
        if (type === 'postal_code') {
          components.postcode = longName;
        } else if (type === 'administrative_area_level_1') {
          components.state = shortName;
        } else if (type === 'locality') {
          components.suburb = longName;
        }
      });
    });
  }

  return components;
};

const GeoSuggestToAddress = suggest => ({
  raw: suggest.label,
  ...parseGmaps(suggest.gmaps),
});

export default GeoSuggestToAddress;

const servicesSummary = (services) => {
  let result = '';

  services.forEach((service) => {
    if (service.baseSelected) {
      if (result.length > 0) {
        result += ', ';
      }
      result += service.name;
    }

    service.addons.forEach((addon) => {
      if (result.length > 0) {
        result += ', ';
      }
      result += addon.name;
    });
  });

  return result;
};

export default servicesSummary;

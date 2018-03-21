const servicesSummary = (services) => {
  let result = '';

  services.forEach((service, index) => {
    result += service.name;

    if (service.addons.length > 0) {
      result += ' (including ';
    }

    service.addons.forEach((addon) => {
      result += addon.name;
    });

    if (service.addons.length > 0) {
      result += ')';
    }

    if (index < services.length - 1) {
      result += ', ';
    }
  });

  return result;
};

export default servicesSummary;

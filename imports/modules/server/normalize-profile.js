const parsePasswordData = (options, user) => ({
  owner: user._id,
  email: user.emails && user.emails[0].address,
  name: options.profile.name,
});

const parseGoogleData = (options, user) => ({
  owner: user._id,
  email: user.services.google.email,
  name: {
    first: user.services.google.given_name,
    last: user.services.google.family_name,
  },
  photo: {
    origin: user.services.google.picture,
  },
  gender: user.services.google.gender,
});

const parseFacebookData = (options, user) => ({
  owner: user._id,
  email: user.services.facebook.email,
  name: {
    first: user.services.facebook.first_name,
    last: user.services.facebook.last_name,
  },
  gender: user.services.facebook.gender,
});

const normalizeProfile = (options, user) => {
  if (user.services.password) {
    return parsePasswordData(options, user);
  } else if (user.services.facebook) {
    return parseFacebookData(options, user);
  } else if (user.services.google) {
    return parseGoogleData(options, user);
  }

  return null;
};

export default normalizeProfile;

const ACCOUNT_STORAGE_KEY = "styroform_account_profile";

export const DEFAULT_ACCOUNT = {
  username: "demo_user",
  password: "password123",
  profileImage: "",
  hasCustomPhoto: false,
};

export function loadAccountProfile() {
  try {
    const rawValue = localStorage.getItem(ACCOUNT_STORAGE_KEY);
    if (!rawValue) return { ...DEFAULT_ACCOUNT };

    const parsedValue = JSON.parse(rawValue);
    return {
      ...DEFAULT_ACCOUNT,
      ...parsedValue,
    };
  } catch {
    return { ...DEFAULT_ACCOUNT };
  }
}

export function saveAccountProfile(accountProfile) {
  const nextValue = {
    ...DEFAULT_ACCOUNT,
    ...accountProfile,
  };

  localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(nextValue));
  return nextValue;
}
